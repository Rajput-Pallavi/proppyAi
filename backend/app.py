import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from flask import Flask, request, jsonify, g
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error, pooling
import bcrypt
import re
import dns.resolver
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime
import traceback

# Gemini Import
from gemini_service import create_gemini_assistant
# ------------------------------------------------------
# Initialize Flask
# ------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------------------------------
# Cloudinary Configuration
# ------------------------------------------------------
cloudinary.config(
    cloud_name='dsk2vrb6n',
    api_key='936624974351843',
    api_secret='YThqcZ6c87XahzLyeu4bM_FA4s8'
)

# ------------------------------------------------------
# Gemini Assistant Setup
# ------------------------------------------------------
API_KEY = "AIzaSyDKC20RVCakItllVUZHxqZXaUJoEznVhcs"
assistant = create_gemini_assistant(API_KEY)

# ------------------------------------------------------
# MySQL Connection Pool Setup
# ------------------------------------------------------
connection_pool = None
QUESTIONS_TABLE_CREATED = False

try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="myapp_pool",
        pool_size=10,
        pool_reset_session=True,
        host='database-1.cfogiwsqseq1.ap-south-1.rds.amazonaws.com',
        user='admin',
        password='raghu2002',
        database='TEST'
    )
    print("✅ Database connection pool created!")
except Error as e:
    print(f"❌ Error creating connection pool: {e}")
    traceback.print_exc()

def get_db():
    """Get database connection from pool for current request"""
    if 'db' not in g:
        try:
            g.db = connection_pool.get_connection()
        except Error as e:
            print(f"❌ Error getting connection from pool: {e}")
            return None
    return g.db

@app.teardown_appcontext
def close_db(error):
    """Return connection to pool at end of request"""
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        db.close()

def ensure_tables_created():
    """Create necessary tables on first connection"""
    global QUESTIONS_TABLE_CREATED
    if QUESTIONS_TABLE_CREATED:
        return
    
    db = get_db()
    if db is None:
        return
    
    cursor = db.cursor()
    try:
        # Create questions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NULL,
                query_text TEXT NOT NULL,
                response_text TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create videos table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                public_id VARCHAR(255) UNIQUE NOT NULL,
                url VARCHAR(500) NOT NULL,
                format VARCHAR(50),
                resource_type VARCHAR(50),
                size_mb DECIMAL(10, 2),
                created_at DATETIME,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        db.commit()
        QUESTIONS_TABLE_CREATED = True
        print("✅ All tables created successfully")
    except Exception as e:
        print(f"❌ Table creation error: {e}")
        traceback.print_exc()
    finally:
        cursor.close()

def is_valid_email(email):
    """Validate email format and domain"""
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(regex, email):
        return False
    
    domain = email.split('@')[1]
    try:
        records = dns.resolver.resolve(domain, 'MX')
        return bool(records)
    except Exception:
        return False

# ------------------------------------------------------
# Gemini Routes
# ------------------------------------------------------
@app.route('/api/search', methods=['POST'])
def search():
    """Handle search requests from frontend and save to database"""
    try:
        if not assistant:
            return jsonify({'error': 'Assistant not initialized'}), 500

        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.json
        query = data.get('query', '').strip()
        user_id = data.get('user_id')

        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400

        print(f"📝 Processing query: {query}")
        response_data = assistant.process_prompt(query)

        # Save question and response to database
        db_saved = False
        insert_id = None
        db = get_db()
        
        if db:
            cursor = db.cursor()
            try:
                ensure_tables_created()
                resp_text = response_data.get('result') if isinstance(response_data, dict) else None
                
                print(f"💾 Saving question to database...")
                cursor.execute(
                    "INSERT INTO questions (user_id, query_text, response_text) VALUES (%s, %s, %s)",
                    (user_id, query, resp_text)
                )
                db.commit()
                insert_id = cursor.lastrowid
                db_saved = True
                print(f"✅ Question saved! ID: {insert_id}")
            except Exception as db_error:
                print(f"❌ Database save failed: {db_error}")
                traceback.print_exc()
                db.rollback()
            finally:
                cursor.close()

        # Add save status to response
        if isinstance(response_data, dict):
            response_data['db_saved'] = db_saved
            response_data['insert_id'] = insert_id

        if response_data.get('status') == 'success':
            return jsonify(response_data), 200
        else:
            return jsonify(response_data), 500

    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'error': f'Unexpected error: {str(e)}',
            'status': 'error',
            'result': None
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check system health"""
    db = get_db()
    db_connected = db.is_connected() if db else False
    
    return jsonify({
        'status': 'healthy',
        'assistant_ready': assistant is not None,
        'db_connected': db_connected,
        'cloudinary_configured': True,
        'cloud_name': 'dsk2vrb6n'
    })

@app.route('/api/questions/recent', methods=['GET'])
def recent_questions():
    """Get recent questions - optionally filter by user_id"""
    try:
        db = get_db()
        if not db:
            return jsonify({'error': 'Database not connected'}), 500

        ensure_tables_created()
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 20))

        cursor = db.cursor(dictionary=True)
        try:
            if user_id:
                cursor.execute(
                    "SELECT id, user_id, query_text, response_text, created_at FROM questions WHERE user_id = %s ORDER BY created_at DESC LIMIT %s",
                    (user_id, limit)
                )
            else:
                cursor.execute(
                    "SELECT id, user_id, query_text, response_text, created_at FROM questions ORDER BY created_at DESC LIMIT %s",
                    (limit,)
                )
            rows = cursor.fetchall()
        finally:
            cursor.close()

        return jsonify({'questions': rows, 'count': len(rows)}), 200
    except Exception as e:
        print(f"❌ Error fetching questions: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ------------------------------------------------------
# Authentication Routes
# ------------------------------------------------------
@app.route('/signup', methods=['POST'])
def signup():
    """User registration"""
    db = get_db()
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")
    student_class = data.get("class")

    if not all([name, email, password, age, student_class]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if not is_valid_email(email):
        return jsonify({"error": "Email is invalid or does not exist"}), 400
    
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO proppy (name, email, password_hash, age, class) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_pw, age, student_class)
        )
        db.commit()
        return jsonify({"message": "User created successfully"}), 201

    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

    except Exception as e:
        print(f"❌ Signup error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

@app.route('/login', methods=['POST'])
def login():
    """User authentication"""
    db = get_db()
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    cursor = db.cursor()
    try:
        cursor.execute("SELECT id, name, email, password_hash FROM proppy WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2]
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

# ------------------------------------------------------
# Cloudinary Video Management Routes
# ------------------------------------------------------
@app.route('/api/videos', methods=['GET'])
def get_videos():
    """Fetch all videos from Cloudinary shorts folder"""
    try:
        result = cloudinary.api.resources(
            type='upload',
            resource_type='video',
            prefix='shorts/',
            max_results=100
        )
        
        videos = []
        for resource in result.get('resources', []):
            videos.append({
                'id': resource['public_id'],
                'url': resource['secure_url'],
                'publicId': resource['public_id'],
                'format': resource.get('format', 'mp4'),
                'resourceType': 'video',
                'width': resource.get('width', 1080),
                'height': resource.get('height', 1920),
                'size': round(resource.get('bytes', 0) / (1024 * 1024), 2),
                'thumbnail': resource['secure_url'].replace('/upload/', '/upload/so_1,w_400,h_400,c_fill/').replace(f".{resource.get('format', 'mp4')}", '.jpg'),
                'createdAt': resource.get('created_at', datetime.now().isoformat())
            })
        
        print(f"✅ Fetched {len(videos)} videos from Cloudinary")
        
        return jsonify({
            'success': True,
            'videos': videos,
            'count': len(videos)
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching videos: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'videos': []
        }), 500

@app.route('/api/videos/<path:public_id>', methods=['DELETE'])
def delete_video(public_id):
    """Delete a video from Cloudinary"""
    try:
        print(f"🗑️ Deleting video: {public_id}")
        
        result = cloudinary.uploader.destroy(
            public_id,
            resource_type='video',
            invalidate=True
        )
        
        if result.get('result') == 'ok':
            print(f"✅ Video deleted successfully: {public_id}")
            
            # Also delete from database if exists
            db = get_db()
            if db:
                cursor = db.cursor()
                try:
                    cursor.execute("DELETE FROM videos WHERE public_id = %s", (public_id,))
                    db.commit()
                except Exception as db_error:
                    print(f"⚠️ Database deletion warning: {db_error}")
                finally:
                    cursor.close()
            
            return jsonify({
                'success': True,
                'message': 'Video deleted successfully'
            }), 200
        else:
            print(f"⚠️ Cloudinary delete returned: {result}")
            return jsonify({
                'success': False,
                'error': 'Failed to delete video from Cloudinary',
                'result': result
            }), 500
            
    except Exception as e:
        print(f"❌ Error deleting video: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/videos/save', methods=['POST'])
def save_video_metadata():
    """Save video metadata to MySQL database"""
    db = get_db()
    if not db:
        return jsonify({"error": "Database not connected"}), 500
    
    try:
        ensure_tables_created()
        data = request.get_json()
        public_id = data.get('publicId')
        url = data.get('url')
        format_type = data.get('format')
        resource_type = data.get('resourceType')
        size = data.get('size')
        created_at = data.get('createdAt')
        
        print(f"💾 Saving video metadata: {public_id}")
        
        cursor = db.cursor()
        try:
            cursor.execute("""
                INSERT INTO videos (public_id, url, format, resource_type, size_mb, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE url = %s
            """, (public_id, url, format_type, resource_type, size, created_at, url))
            
            db.commit()
            print(f"✅ Video metadata saved: {public_id}")
            
            return jsonify({
                'success': True,
                'message': 'Video metadata saved to database'
            }), 201
        finally:
            cursor.close()
        
    except Exception as e:
        print(f"❌ Error saving video metadata: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/videos/stats', methods=['GET'])
def get_video_stats():
    """Get video statistics"""
    try:
        result = cloudinary.api.resources(
            type='upload',
            resource_type='video',
            prefix='shorts/',
            max_results=500
        )
        
        total_videos = len(result.get('resources', []))
        total_size = sum(r.get('bytes', 0) for r in result.get('resources', []))
        total_size_mb = round(total_size / (1024 * 1024), 2)
        
        return jsonify({
            'success': True,
            'stats': {
                'totalVideos': total_videos,
                'totalSizeMB': total_size_mb,
                'averageSizeMB': round(total_size_mb / total_videos, 2) if total_videos > 0 else 0
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching stats: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ------------------------------------------------------
# Root Endpoint
# ------------------------------------------------------
@app.route('/', methods=['GET'])
def root():
    """API documentation"""
    return jsonify({
        'message': 'Merged Flask API with Gemini, Auth, Questions, and Cloudinary',
        'endpoints': [
            {'method': 'POST', 'path': '/api/search', 'description': 'Gemini search with question saving'},
            {'method': 'GET', 'path': '/api/health', 'description': 'Health check'},
            {'method': 'GET', 'path': '/api/questions/recent', 'description': 'Get recent questions'},
            {'method': 'POST', 'path': '/signup', 'description': 'User signup'},
            {'method': 'POST', 'path': '/login', 'description': 'User login'},
            {'method': 'GET', 'path': '/api/videos', 'description': 'Get all videos from Cloudinary'},
            {'method': 'DELETE', 'path': '/api/videos/<public_id>', 'description': 'Delete video'},
            {'method': 'POST', 'path': '/api/videos/save', 'description': 'Save video metadata'},
            {'method': 'GET', 'path': '/api/videos/stats', 'description': 'Get video statistics'}
        ],
        'features': {
            'connection_pooling': True,
            'cloudinary_configured': True,
            'gemini_assistant': assistant is not None,
            'cloud_name': 'dsk2vrb6n'
        }
    })

# ------------------------------------------------------
# Run Server
# ------------------------------------------------------
if __name__ == '__main__':
    print("🚀 Starting merged Flask server on port 5000")
    print("📊 Features: Gemini AI, Auth, Questions DB, Cloudinary Videos")
    print("💾 Connection pooling enabled (pool size: 10)")
    app.run(debug=True, port=5000)

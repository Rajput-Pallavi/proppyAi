import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import bcrypt
import re
import dns.resolver
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime

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
    api_key='936624974351843',      # Replace with your API Key
    api_secret='YThqcZ6c87XahzLyeu4bM_FA4s8'  # Replace with your API Secret
)

# ------------------------------------------------------
# Gemini Assistant Setup
# ------------------------------------------------------
API_KEY = "AIzaSyDKC20RVCakItllVUZHxqZXaUJoEznVhcs"
assistant = create_gemini_assistant(API_KEY)

# ------------------------------------------------------
# MySQL Database Connection
# ------------------------------------------------------
try:
    db = mysql.connector.connect(
        host='database-1.cfogiwsqseq1.ap-south-1.rds.amazonaws.com',
        user='admin',
        password='raghu2002',
        database='TEST'
    )

    if db.is_connected():
        print("✅ Database connected!")
        print("MySQL Server version:", db.server_info)

except Error as e:
    print("❌ Error while connecting to MySQL:", e)
    db = None

cursor = db.cursor() if db else None

def is_valid_email(email):
    # Basic regex check
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(regex, email):
        return False
    
    # Check if domain has MX records (i.e., can receive email)
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
    """
    Handle search requests from frontend
    """
    try:
        if not assistant:
            return jsonify({'error': 'Assistant not initialized'}), 500

        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.json
        query = data.get('query', '').strip()

        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400

        print(f"📝 Processing query: {query}")
        response_data = assistant.process_prompt(query)

        if response_data['status'] == 'success':
            return jsonify(response_data), 200
        else:
            return jsonify(response_data), 500

    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return jsonify({
            'error': f'Unexpected error: {str(e)}',
            'status': 'error',
            'result': None
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'assistant_ready': assistant is not None,
        'db_connected': db.is_connected() if db else False
    })

# ------------------------------------------------------
# Signup Route (Auth)
# ------------------------------------------------------
@app.route('/signup', methods=['POST'])
def signup():
    if not db or not cursor:
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

# ------------------------------------------------------
# Login Route (Auth)
# ------------------------------------------------------
@app.route('/login', methods=['POST'])
def login():
    if not db or not cursor:
        return jsonify({"error": "Database not connected"}), 500

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        cursor.execute("SELECT id, name, email, password_hash FROM proppy WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2],
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({"error": str(e)}), 500

# ------------------------------------------------------
# Cloudinary Video Management Routes
# ------------------------------------------------------

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """
    Fetch all videos from Cloudinary shorts folder
    """
    try:
        # Fetch videos from Cloudinary
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
                'size': round(resource.get('bytes', 0) / (1024 * 1024), 2),  # MB
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
        return jsonify({
            'success': False,
            'error': str(e),
            'videos': []
        }), 500


@app.route('/api/videos/<path:public_id>', methods=['DELETE'])
def delete_video(public_id):
    """
    Delete a video from Cloudinary
    """
    try:
        print(f"🗑️ Deleting video: {public_id}")
        
        # Delete from Cloudinary
        result = cloudinary.uploader.destroy(
            public_id,
            resource_type='video',
            invalidate=True
        )
        
        if result.get('result') == 'ok':
            print(f"✅ Video deleted successfully: {public_id}")
            
            # Also delete from database if exists
            if db and cursor:
                try:
                    cursor.execute("DELETE FROM videos WHERE public_id = %s", (public_id,))
                    db.commit()
                except:
                    pass
            
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
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/videos/save', methods=['POST'])
def save_video_metadata():
    """
    Save video metadata to MySQL database (optional)
    """
    if not db or not cursor:
        return jsonify({"error": "Database not connected"}), 500
    
    try:
        data = request.get_json()
        public_id = data.get('publicId')
        url = data.get('url')
        format_type = data.get('format')
        resource_type = data.get('resourceType')
        size = data.get('size')
        created_at = data.get('createdAt')
        
        print(f"💾 Saving video metadata: {public_id}")
        
        # Create videos table if not exists
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
        
        # Insert video metadata
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
        
    except Exception as e:
        print(f"❌ Error saving video metadata: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/videos/stats', methods=['GET'])
def get_video_stats():
    """
    Get video statistics
    """
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
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ------------------------------------------------------
# Root Endpoint
# ------------------------------------------------------
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'Merged Flask API with Cloudinary Integration',
        'endpoints': [
            {'method': 'POST', 'path': '/api/search', 'description': 'Gemini search'},
            {'method': 'GET', 'path': '/api/health', 'description': 'Health check'},
            {'method': 'POST', 'path': '/signup', 'description': 'User signup'},
            {'method': 'POST', 'path': '/login', 'description': 'User login'},
            {'method': 'GET', 'path': '/api/videos', 'description': 'Get all videos'},
            {'method': 'DELETE', 'path': '/api/videos/<public_id>', 'description': 'Delete video'},
            {'method': 'POST', 'path': '/api/videos/save', 'description': 'Save video metadata'},
            {'method': 'GET', 'path': '/api/videos/stats', 'description': 'Get video statistics'}
        ],
        'cloudinary_configured': True,
        'cloud_name': 'dsk2vrb6n'
    })

# ------------------------------------------------------
# Run Server
# ------------------------------------------------------
if __name__ == '__main__':
    print("🚀 Starting merged Flask server with Cloudinary on port 5000")
    print("📹 Cloudinary Cloud Name: dsk2vrb6n")
    app.run(debug=True, port=5000)

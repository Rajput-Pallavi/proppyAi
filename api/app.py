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
import traceback

# Gemini Import
from gemini_service import create_gemini_assistant

# ------------------------------------------------------
# Initialize Flask
# ------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------------------------------
# Gemini Assistant Setup
# ------------------------------------------------------
API_KEY = "AIzaSyDKC20RVCakItllVUZHxqZXaUJoEznVhcs"
assistant = create_gemini_assistant(API_KEY)

# ------------------------------------------------------
# MySQL Database Connection
# ------------------------------------------------------
db = None
QUESTIONS_TABLE_CREATED = False

def ensure_db_connection():
    """Ensure a live DB connection and return it."""
    global db
    try:
        if db is None or not db.is_connected():
            db = mysql.connector.connect(
                host='database-1.cfogiwsqseq1.ap-south-1.rds.amazonaws.com',
                user='admin',
                password='raghu2002',
                database='TEST'
            )
            print("✅ Database connected!")
            print("MySQL Server version:", db.server_info if hasattr(db, 'server_info') else db.get_server_info())
            
            # Create questions table if it doesn't exist
            global QUESTIONS_TABLE_CREATED
            if not QUESTIONS_TABLE_CREATED:
                cur = db.cursor()
                try:
                    cur.execute(
                        """
                        CREATE TABLE IF NOT EXISTS questions (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id INT NULL,
                            query_text TEXT NOT NULL,
                            response_text TEXT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                        """
                    )
                    db.commit()
                    print("✅ Questions table ready in TEST database")
                    QUESTIONS_TABLE_CREATED = True
                except Exception as table_error:
                    print(f"❌ Table creation error: {table_error}")
                    traceback.print_exc()
                finally:
                    cur.close()
        return db
    except Error as e:
        print("❌ Error while connecting to MySQL:", e)
        traceback.print_exc()
        db = None
        return None

# Initial connection
ensure_db_connection()

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
    """
    Handle search requests from frontend and save to database
    """
    try:
        if not assistant:
            return jsonify({'error': 'Assistant not initialized'}), 500

        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.json
        query = data.get('query', '').strip()
        user_id = data.get('user_id')  # Optional: get user_id from request

        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400

        print(f"📝 Processing query: {query}")
        response_data = assistant.process_prompt(query)

        # Save question and response to database
        db_saved = False
        insert_id = None
        try:
            conn = ensure_db_connection()
            if conn:
                resp_text = response_data.get('result') if isinstance(response_data, dict) else None
                write_cursor = conn.cursor()
                try:
                    print(f"💾 Saving question to database...")
                    write_cursor.execute(
                        "INSERT INTO questions (user_id, query_text, response_text) VALUES (%s, %s, %s)",
                        (user_id, query, resp_text)
                    )
                    conn.commit()
                    insert_id = write_cursor.lastrowid
                    db_saved = True
                    print(f"✅ Question saved! ID: {insert_id}")
                except Exception as db_error:
                    print(f"❌ Database save failed: {db_error}")
                    traceback.print_exc()
                    conn.rollback()
                finally:
                    write_cursor.close()
        except Exception as e:
            print(f"❌ Failed to save question: {e}")
            traceback.print_exc()

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
    conn = ensure_db_connection()
    return jsonify({
        'status': 'healthy',
        'assistant_ready': assistant is not None,
        'db_connected': conn.is_connected() if conn else False
    })

@app.route('/api/questions/recent', methods=['GET'])
def recent_questions():
    """Get recent questions - optionally filter by user_id"""
    try:
        conn = ensure_db_connection()
        if not conn:
            return jsonify({'error': 'Database not connected'}), 500

        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 20))

        cursor = conn.cursor(dictionary=True)
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
# Signup Route (Auth)
# ------------------------------------------------------
@app.route('/signup', methods=['POST'])
def signup():
    """User registration"""
    conn = ensure_db_connection()
    if not conn:
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

    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO proppy (name, email, password_hash, age, class) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_pw, age, student_class)
        )
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201

    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

    except Exception as e:
        print(f"❌ Signup error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

# ------------------------------------------------------
# Login Route (Auth)
# ------------------------------------------------------
@app.route('/login', methods=['POST'])
def login():
    """User authentication"""
    conn = ensure_db_connection()
    if not conn:
        return jsonify({"error": "Database not connected"}), 500

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    cursor = conn.cursor()
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
# Root Endpoint
# ------------------------------------------------------
@app.route('/', methods=['GET'])
def root():
    """API documentation"""
    return jsonify({
        'message': 'Flask API with Question Saving',
        'endpoints': [
            {'method': 'POST', 'path': '/api/search', 'description': 'Search and save questions'},
            {'method': 'GET', 'path': '/api/health', 'description': 'Health check'},
            {'method': 'GET', 'path': '/api/questions/recent', 'description': 'Get recent questions'},
            {'method': 'POST', 'path': '/signup', 'description': 'User signup'},
            {'method': 'POST', 'path': '/login', 'description': 'User login'}
        ]
    })

# ------------------------------------------------------
# Run Server
# ------------------------------------------------------
if __name__ == '__main__':
    print("🚀 Starting Flask server on port 5000")
    print("📊 Questions will be saved to TEST.questions table")
    app.run(debug=True, port=5000)

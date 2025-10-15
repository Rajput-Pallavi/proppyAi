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
# Root Endpoint
# ------------------------------------------------------
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'Merged Flask API',
        'endpoints': [
            {'method': 'POST', 'path': '/api/search'},
            {'method': 'GET', 'path': '/api/health'},
            {'method': 'POST', 'path': '/signup'}
        ]
    })

# ------------------------------------------------------
# Run Server
# ------------------------------------------------------
if __name__ == '__main__':
    print("🚀 Starting merged Flask server on port 5000")
    app.run(debug=True, port=5000)

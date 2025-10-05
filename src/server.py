from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import bcrypt

app = Flask(__name__)
CORS(app)


# Database connection
try:
    # Attempt to connect to the database
    db = mysql.connector.connect(
        host='database-1.cfogiwsqseq1.ap-south-1.rds.amazonaws.com',       # or your DB host
        user='admin',   # your DB username
        password='raghu2002',  # your DB password
        database='TEST'   # optional, can skip if just testing connection
    )

    if db.is_connected():
        print("Database is connected!")
        # You can also get server info
        db_info = db.server_info 

        print("MySQL Server version:", db.server_info)

except Error as e:
    print("Error while connecting to MySQL:", e)


cursor = db.cursor()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")
    student_class = data.get("class")

    if not all([name, email, password, age, student_class]):
        return jsonify({"error": "Missing required fields"}), 400

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
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)
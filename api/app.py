import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini_service import create_gemini_assistant


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Configuration
API_KEY = "AIzaSyDKC20RVCakItllVUZHxqZXaUJoEznVhcs"

# Initialize Gemini Assistant
assistant = create_gemini_assistant(API_KEY)

@app.route('/api/search', methods=['POST'])
def search():
    """
    Handle search requests from frontend
    """
    try:
        # Check if assistant is initialized
        if not assistant:
            return jsonify({
                'error': 'Assistant not initialized. Please check your API key.',
                'status': 'error'
            }), 500
        
        # Validate request
        if not request.is_json:
            return jsonify({
                'error': 'Request must be JSON',
                'status': 'error'
            }), 400
        
        data = request.json
        query = data.get('query', '').strip()
        
        # Validate query
        if not query:
            return jsonify({
                'error': 'Query parameter is required',
                'status': 'error'
            }), 400
        
        print(f"📝 Processing query: {query}")
        
        # Process with Gemini
        response_data = assistant.process_prompt(query)
        
        if response_data['status'] == 'success':
            print(f"🤖 Response: {response_data['result']}")
            return jsonify(response_data), 200
        else:
            print(f"❌ Error: {response_data['error']}")
            return jsonify(response_data), 500
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return jsonify({
            'error': f'Unexpected error: {str(e)}',
            'status': 'error',
            'result': None,
            'query': query if 'query' in locals() else None
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'assistant_ready': assistant is not None,
        'message': 'Flask API is running'
    })

@app.route('/', methods=['GET'])
def root():
    """
    Root endpoint
    """
    return jsonify({
        'message': 'Gemini Flask API',
        'endpoints': [
            {'method': 'POST', 'path': '/api/search', 'description': 'Process search queries'},
            {'method': 'GET', 'path': '/api/health', 'description': 'Health check'}
        ]
    })

if __name__ == '__main__':
    print("🚀 Starting Flask API server...")
    print("📡 Endpoints available:")
    print("   POST /api/search - Process queries")
    print("   GET  /api/health - Health check")
    print("   GET  / - API info")
    app.run(debug=True, port=5000)

import { FileStructure } from './types';

export const BACKEND_PROJECT: FileStructure[] = [
  {
    path: 'app.py',
    language: 'python',
    description: 'The simplified Flask connector file.',
    content: `from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
# Enable CORS so your React app can talk to this backend
CORS(app)

@app.route('/connect', methods=['POST'])
def connect():
    """
    Receives JSON: { "message": "..." }
    Forwards it to n8n and returns a status.
    """
    # Get the data sent from the frontend
    data = request.get_json()
    
    # Get the n8n URL from your environment settings
    webhook_url = os.getenv('N8N_WEBHOOK_URL')
    
    if not webhook_url:
        return jsonify({"error": "N8N_WEBHOOK_URL not configured"}), 500

    try:
        # Forward the message to n8n
        requests.post(webhook_url, json=data)
        
        # Tell the frontend everything went well
        return jsonify({"status": "sent_to_n8n"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use the port Railway gives us, or default to 5000
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)`
  },
  {
    path: 'requirements.txt',
    language: 'text',
    description: 'Minimal list of Python packages.',
    content: `flask
flask-cors
requests
gunicorn`
  },
  {
    path: '.env.example',
    language: 'text',
    description: 'Template for your n8n URL.',
    content: `N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/test-id`
  },
  {
    path: 'Procfile',
    language: 'text',
    description: 'Instructions for Railway production server.',
    content: `web: gunicorn app:app`
  }
];

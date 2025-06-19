import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'logs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/upload-log', methods=['POST'])
def upload_log():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    # Basic parsing example
    errors = []
    with open(path, 'r') as f:
        for line in f:
            if 'error' in line.lower():
                errors.append(line.strip())

    return jsonify({
        'filename': file.filename,
        'error_count': len(errors),
        'errors': errors[:10]  # Return first 10 for now
    })

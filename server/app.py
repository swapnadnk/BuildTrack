import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import re
from collections import defaultdict

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

    error_summary = defaultdict(int)
    error_lines = []
    timestamped_errors = []

    error_regex = re.compile(r'(.*)?(error|exception)(.*)', re.IGNORECASE)
    timestamp_regex = re.compile(r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}')

    with open(path, 'r') as f:
        for line in f:
            match = error_regex.search(line)
            if match:
                error_msg = match.group(0).strip()
                error_lines.append(line.strip())

                # Improved error type extraction
                error_words = error_msg.split()
                if len(error_words) >= 2:
                    error_type = error_words[5].strip(':')
                else:
                    error_type = 'UnknownError'

                error_summary[error_type] += 1

                # Timestamp check
                ts_match = timestamp_regex.search(line)
                if ts_match:
                    timestamped_errors.append({
                        'timestamp': ts_match.group(0),
                        'error': error_msg
                    })

    return jsonify({
        'filename': file.filename,
        'error_count': len(error_lines),
        'error_types': dict(error_summary),
        'recent_errors': error_lines[:10],
        'timestamped': timestamped_errors[-10:]  # last 10 with timestamps
    })

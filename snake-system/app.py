from flask import Flask, send_from_directory, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.get_json()
    
    name=data.get('name')
    score=data.get('score') 
    cause=data.get('cause')
    duration=data.get('duration')
    timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if not name or score is None or cause not in ["WALL", "SELF"] or duration is None:
        return jsonify({"error": "Invalid data"}), 400

    line=f"[{timestamp}] {name} | {score} | {cause} | {duration}\n"

    with open('history.txt', 'a') as f:
        f.write(line)

    return jsonify({'message': 'Score saved successfully'}), 200

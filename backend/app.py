# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os

# app = Flask(__name__)
# CORS(app)  # This will enable CORS for all routes

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"})
    
#     file = request.files['file']
    
#     if file.filename == '':
#         return jsonify({"error": "No selected file"})
    
#     if file:
#         filename = file.filename
#         file.save(os.path.join("uploads", filename))
        
#         # Process the video and return a sample response
#         return jsonify({"text": "Processed text from video"})
    
# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure the uploads directory exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/uploadvideo', methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    if file:
        filename = file.filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        
        # Process the video and return a sample response
        return jsonify({"translatedText": "Processed text from video"})
    
@app.route('/uploadtext', methods=['POST'])
def upload_text():
    print("hello hello hello hello 4")
    return jsonify({"text": "sample text from backend"})

    
if __name__ == '__main__':
    app.run(debug=True)
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

@app.route('/upload-keypoints', methods=['POST'])
def upload_keypoints():
    try:
        # Parse the incoming JSON data
        data = request.json
        keypoints = data.get('keypoints')

        # Log the received keypoints to verify
        print('Received keypoints:', keypoints)

        # Here you can process the keypoints data and perform any necessary operations
        # For example, you might want to run a model on the keypoints data

        # Simulate a translation result
        translated_text = 'Simulated translation text based on received keypoints'

        # Respond with the translation result
        return jsonify({'translatedText': translated_text})

    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
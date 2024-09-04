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
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure the uploads directory exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# def extract_pose_keypoints(results):
#     pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.poseLandmarks]).flatten() if results.poseLandmarks else np.zeros(33 * 4)
#     selected_pose = np.concatenate([pose[:1 * 4], pose[2*4:3*4], pose[5 * 4:6 * 4] ,
#                                     pose[7 * 4:23 * 4] ]) 
#     return selected_pose

# l_hand_detected = False

# def extract_lhand_keypoints(results):
#     global l_hand_detected
#     if results.left_hand_landmarks:
#         lhand = np.array([[res.x, res.y, res.z] for res in results.leftHandLandmarks]).flatten()
#         l_hand_detected = True
#     else:
#         lhand = np.zeros(21*3)
#         l_hand_detected = False
#     return lhand

def extract_pose_keypoints(results):
    pose_landmarks = results.get('poseLandmarks', [])
    pose = np.array([[res['x'], res['y'], res['z'], res['visibility']] for res in pose_landmarks]).flatten() if pose_landmarks else np.zeros(33 * 4)
    selected_pose = np.concatenate([pose[:1 * 4], pose[2*4:3*4], pose[5 * 4:6 * 4], pose[7 * 4:23 * 4]])
    return selected_pose

l_hand_detected = False

def extract_lhand_keypoints(results):
    global l_hand_detected
    left_hand_landmarks = results.get('leftHandLandmarks', [])
    if left_hand_landmarks:
        lhand = np.array([[res['x'], res['y'], res['z']] for res in left_hand_landmarks]).flatten()
        l_hand_detected = True
    else:
        lhand = np.zeros(21 * 3)
        l_hand_detected = False
    return lhand

# r_hand_detected = False

# def extract_rhand_keypoints(results):
#     global l_hand_detected
#     if results.right_hand_landmarks:
#         rhand = np.array([[res.x, res.y, res.z] for res in results.rightHandLandmarks]).flatten()
#         r_hand_detected = True
#     else:
#         rhand = np.zeros(21*3)
#         r_hand_detected = False
#     return rhand

# def extract_keypoints(results):
#     pose = extract_pose_keypoints(results)
#     face = np.array([[res.x, res.y, res.z] for res in results.faceLandmarks]).flatten() if results.face_landmarks else np.zeros(468*3)
#     lh = extract_lhand_keypoints(results)
#     rh = extract_rhand_keypoints(results)
#     return np.concatenate([pose, face, lh, rh])

r_hand_detected = False

def extract_rhand_keypoints(results):
    global r_hand_detected
    right_hand_landmarks = results.get('rightHandLandmarks', [])
    if right_hand_landmarks:
        rhand = np.array([[res['x'], res['y'], res['z']] for res in right_hand_landmarks]).flatten()
        r_hand_detected = True
    else:
        rhand = np.zeros(21 * 3)
        r_hand_detected = False
    return rhand

def extract_keypoints(results):
    pose = extract_pose_keypoints(results)
    lhand = extract_lhand_keypoints(results)
    rhand = extract_rhand_keypoints(results)
    face_landmarks = results.get('faceLandmarks', [])
    face = np.array([[res['x'], res['y'], res['z']] for res in face_landmarks]).flatten() if face_landmarks else np.zeros(468*3)
    return np.concatenate([pose,face, lhand, rhand])

actions = np.array(['Aeroplane','Blind','Daughter','I','India','Son','Book','Fish','Thank You','Love','Sad'])


model = Sequential()
model.add(LSTM(26, return_sequences=True, activation='relu', input_shape=(30,1606)))
model.add(LSTM(100, return_sequences=True, activation='relu'))
model.add(LSTM(60, return_sequences=False, activation='relu'))
model.add(Dense(52, activation='relu'))
model.add(Dense(200, activation='relu'))
model.add(Dense(120, activation='relu'))
model.add(Dense(240, activation='relu'))
model.add(Dense(120, activation='relu'))
model.add(Dense(200, activation='relu'))
model.add(Dense(52, activation='relu'))
model.add(Dense(26, activation='relu'))
model.add(Dense(actions.shape[0], activation='softmax'))




# 1. New detection variables
sequence = []
sentence = []
predictions = []
threshold = 0.5

def sign_to_text(results):
        
        global sequence
        global sentence
        global predictions
        global threshold
        
        # 2. Prediction logic
        # keypoints = extract_keypoints(results)
        sequence.append(results)
        sequence = sequence[-30:]
        
        if len(sequence) == 30:
            res = model.predict(np.expand_dims(sequence, axis=0))[0]
            print(actions[np.argmax(res)])
            predictions.append(np.argmax(res))

            
            
        #3. Viz logic
            if np.unique(predictions[-10:])[0]==np.argmax(res): 
                if res[np.argmax(res)] > threshold: 
                    
                    if len(sentence) > 0: 
                        if actions[np.argmax(res)] != sentence[-1]:
                            sentence.append(actions[np.argmax(res)])
                    else:
                        sentence.append(actions[np.argmax(res)])
            
            if l_hand_detected==False or r_hand_detected==False:
                sentence.append('None')

            if len(sentence) >2: 
                sentence = sentence[-2:]
            return sentence
            
        



@app.route('/upload-keypoints', methods=['POST'])
def upload_keypoints():
    try:
        # Parse the incoming JSON data
        data = request.json
        keypoints = data.get('keypoints')

        # print(keypoints)

        # Log the received keypoints to verify
        # print('Received keypoints:', keypoints)
        keypoints=extract_keypoints(keypoints)
        print(keypoints)



        # Here you can process the keypoints data and perform any necessary operations
        # For example, you might want to run a model on the keypoints data

        # Simulate a translation result
        # translated_text = 'Simulated translation text based on received keypoints'
        translated_text = sign_to_text(keypoints)

        # Respond with the translation result
        return jsonify({'translatedText': translated_text})

    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)


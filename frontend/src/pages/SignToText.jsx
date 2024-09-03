import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import '../styles/SignToText.css';
import { ArrowCircleRight } from '@mui/icons-material';
import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';

const SignToText = () => {
    const webcamRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [translatedText, setTranslatedText] = useState('');
    const [camera, setCamera] = useState(null);

    // Initialize Holistic
    const holistic = new Holistic({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    // Define onResults function
    const onResults = async (results) => {
        const keypoints = {
            poseLandmarks: results.poseLandmarks,
            faceLandmarks: results.faceLandmarks,
            leftHandLandmarks: results.leftHandLandmarks,
            rightHandLandmarks: results.rightHandLandmarks,
        };

        console.log("Received keypoints:", keypoints);

        try {
            const response = await fetch('http://localhost:5000/upload-keypoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keypoints }),
            });

            if (response.ok) {
                const data = await response.json();
                setTranslatedText(data.translatedText);
            } else {
                console.error('Failed to get translation from backend');
                setTranslatedText('Error in translation');
            }
        } catch (error) {
            console.error('Error:', error);
            setTranslatedText('Error in translation');
        }
    };

    // Set onResults callback
    useEffect(() => {
        holistic.onResults(onResults);

        return () => {
            if (camera) {
                camera.stop();
            }
        };
    }, [camera]);

    const startRecording = () => {
        setRecording(true);
        const newCamera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
                // Check if holistic instance is available
                if (holistic) {
                    await holistic.send({ image: webcamRef.current.video });
                }
            },
            width: 1280,
            height: 720,
        });
        newCamera.start();
        setCamera(newCamera);
    };

    const stopRecording = () => {
        setRecording(false);
        if (camera) {
            camera.stop();
        }
    };

    return (
        <>
            <div className='top'><ArrowCircleRight style={{ fontSize: "15vh", color: "rgba(203,255,255,1)" }} /></div>
            <div className="translator-container">
                <h1 className="translator-title">Indian Sign Language Translator</h1>
                <p className="translator-subtitle">
                    Record Indian Sign Language videos to text with our powerful AI-powered translator.
                    Start recording and see the corresponding text displayed in real-time.
                </p>
                <div className="translator-content">
                    <div className="recording-section">
                        <div className="recording-box">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                    width: 1280,
                                    height: 720,
                                    facingMode: 'user',
                                }}
                                className="webcam"
                            />
                        </div>
                        <p className="recording-text">Record a video of someone signing in Indian Sign Language</p>
                        {!recording ? (
                            <button onClick={startRecording} className="record-button">
                                Start Recording
                            </button>
                        ) : (
                            <button onClick={stopRecording} className="record-button">
                                Stop Recording
                            </button>
                        )}
                    </div>
                    <div className="translation-section">
                        <div className="translation-box">
                            <h2>Translation</h2>
                            <textarea
                                className="translation-text"
                                value={translatedText || 'The translated text will be displayed here'}
                                readOnly
                                style={{ height: "30vh", width: "85%" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignToText;
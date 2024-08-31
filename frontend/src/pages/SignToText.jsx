import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../styles/SignToText.css';
import { ArrowCircleRight } from '@mui/icons-material';

const SignToText = () => {
    const webcamRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [videoURL, setVideoURL] = useState(null);
    const [translatedText, setTranslatedText] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = () => {
        setRecording(true);
        const recorder = new MediaRecorder(webcamRef.current.stream);
        setMediaRecorder(recorder);
        const chunks = [];

        recorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setVideoURL(url);

            // Send video to backend
            const formData = new FormData();
            formData.append('video', blob, 'sign-language-video.mp4');

            try {
                const response = await fetch('http://127.0.0.1:5000/uploadvideo', {
                    method: 'POST',
                    body: formData,
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

        recorder.start();
    };

    console.log(translatedText);

    const stopRecording = () => {
        setRecording(false);
        mediaRecorder.stop();
    };

    return (
      <>
      <div className='top' ><ArrowCircleRight style={{ fontSize:"15vh", color:"rgba(203,255,255,1)" }} /></div>
        <div className="translator-container">
            <h1 className="translator-title">Indian Sign Language Translator</h1>
            <p className="translator-subtitle">
                Record Indian Sign Language videos to text with our powerful AI-powered translator.
                Start recording and see the corresponding text displayed in real-time.
            </p>
            <div className="translator-content">
                <div className="recording-section">
                    <div className="recording-box">
                        {videoURL ? (
                            <video src={videoURL} controls width="100%" />
                        ) : (
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
                        )}
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
// src/App.jsx
import React, { useState } from "react";
import { Button } from "@mui/material";
import "../styles/TextToSign.css";
import { Mic } from "@mui/icons-material";

function TextToSign() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState(""); // State to store the backend response

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };

    recognition.onspeechend = () => {
      recognition.stop();
      console.log("Voice recognition stopped.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);

      // Call the backend API with the transcript
      fetchTranslation(transcript);
    };

    recognition.start();
  };

  const fetchTranslation = async (inputText) => {
    try {
      console.log(text);
      const response = await fetch("http://127.0.0.1:5000/uploadtext", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponse(data.text); // Update the state with the backend response

    } catch (error) {
      console.error("Error fetching translation:", error);
    }
  };

  return (
    <div className="container">
      <div className="header2">Bridging the Communication Gap</div>
      <div className="caption">
        Seamlessly Convert Text and Voice into Indian Sign Language for a More
        Inclusive World.
      </div>
      <div className="content">
        <div className="abc">
          <Mic className="mic" style={{
            fontSize: "3rem", border: "1px solid white", borderRadius : "50%", padding : "0.7rem"
          }}
            onClick={startRecognition}
          />
          <input
            className="input-box"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start speaking or type here"
          />
          <Button variant="contained" className="translate-button">
            Translate
          </Button>
        </div>
        <div className="models-section">
          <div className="model-box">{response || "3D Sign Language Model"}</div>
        </div>
      </div>
    </div>
  );
}

export default TextToSign;

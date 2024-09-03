// src/App.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "../styles/TextToSign.css";
import { Mic } from "@mui/icons-material";
import ThreeD_Component from "../components/3DAnimate"
import Videos_Component from "../components/VideoAnimate"
import Letters_Component from "../components/LettersAnimate"

function TextToSign() {
  const [option, setOption] = useState("3D");
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
      // fetchTranslation(transcript);
    };

    recognition.start();
  };

  // const fetchTranslation = async (inputText) => {
  //   try {
  //     console.log(text);
  //     const response = await fetch("http://127.0.0.1:5000/uploadtext", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ text: inputText }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     setResponse(data.text); // Update the state with the backend response

  //   } catch (error) {
  //     console.error("Error fetching translation:", error);
  //   }
  // };

  const RenderComponent = ()=>{
    switch (option){
      case '3D':
        return <ThreeD_Component />;
      case 'Videos':
        return <Videos_Component />;
      case 'Letters':
        return <Letters_Component text={text} />;
      default:
        return null;
    }
  }

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
          <div className="options">
            <button className="option-buttons" onClick={()=> setOption("3D")}>3D</button>
            <button className="option-buttons" onClick={()=> setOption("Videos")}>Video</button>
            <button className="option-buttons" onClick={()=> setOption("Letters")}>Letters</button>
          </div>
          <div className="model-box">
            {RenderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextToSign;

import React, { useState, useEffect } from 'react';
import { lettersPhotoMapping } from "../constants/letters_TO_img.js";

const Letters_Component = ({ text }) => {
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBlank, setShowBlank] = useState(false); // To toggle blank display between letters

  useEffect(() => {
    // Reset index, photo, and blank state when text changes
    setCurrentIndex(0);
    setCurrentPhoto(null);
    setShowBlank(false);
  }, [text]);

  useEffect(() => {
    if (text && currentIndex < text.length) {
      if (!showBlank) {
        // Show the current letter
        const letter = text[currentIndex].toLowerCase();
        const photoPath = lettersPhotoMapping[letter];

        setCurrentPhoto(photoPath || null); // Set the photo if it exists, else null

        const timer = setTimeout(() => {
          setShowBlank(true); // After displaying the letter, toggle to blank state
        }, 1000); // Delay for showing the letter

        return () => clearTimeout(timer);
      } else {
        // Blank display
        const timer = setTimeout(() => {
          setCurrentIndex((prevIndex) => prevIndex + 1); // Move to the next letter
          setShowBlank(false); // Toggle back to show the next letter
        }, 200); // Adjust this delay for the blank period between letters

        return () => clearTimeout(timer);
      }
    }
  }, [text, currentIndex, showBlank]);

  return (
    <div style={{ padding: '20px', minHeight: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      {showBlank ? (
        <span style={{fontSize: '2rem'}}> </span> // Blank space between letters
      ) : currentPhoto ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: '100%', width: '100%' }}>
          <img src={currentPhoto} style={{ width: '80%', height: '80%', borderRadius: '5vh' }} alt={text[currentIndex]} />
          <div style={{ fontSize: '5rem', fontWeight: '900' }}>{text[currentIndex] ? text[currentIndex].toUpperCase() : text[currentIndex]}</div>
        </div>
      ) : (
        <span>No corresponding photo</span>
      )}
    </div>
  );
};

export default Letters_Component;
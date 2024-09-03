import React, { useState, useEffect } from 'react';
import { lettersPhotoMapping } from "../constants/letters_TO_img.js";

const Letters_Component = ({ text }) => {
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset index and photo when text changes
    setCurrentIndex(0);
    setCurrentPhoto(null);
  }, [text]);

  useEffect(() => {
    if (text && currentIndex < text.length) {
      const letter = text[currentIndex].toLowerCase();
      const photoPath = lettersPhotoMapping[letter];

      // If the photo exists, set it and proceed
      if (photoPath) {
        setCurrentPhoto(photoPath);

        const timer = setTimeout(() => {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 1000); // Adjust this delay as needed

        return () => clearTimeout(timer);
      } else {
        // If no photo exists, immediately move to the next letter
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [text, currentIndex]);

  

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', minHeight: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {currentPhoto ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <img src={currentPhoto} style={{ width: '100px', height: '100px' }} alt={text[currentIndex]} />
          <div>{text[currentIndex]}</div>
        </div>
      ) : (
        <span>No corresponding photo</span>
      )}
    </div>
  );
};

export default Letters_Component;
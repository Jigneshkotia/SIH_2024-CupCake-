import React, { useState, useEffect } from 'react';
import { WordVideoMapping } from "../constants/words_To_videos.js";

const VideoAnimate = ({text}) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    if (currentIndex < words.length) {
      const word = words[currentIndex].toLowerCase();
      const videoPath = WordVideoMapping[word];

      // If a video exists for the word, set it to be played
      if (videoPath) {
        setCurrentVideo(videoPath);
      } else {
        // If no video exists, immediately move to the next word
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [currentIndex, words]);

  useEffect(()=>{
    setCurrentIndex(0);
  },[text])

  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow:"hidden" }}>
      {currentVideo ? (
        <video
          src={currentVideo}
          width="800"
          // height="600"
          autoPlay
          controls
          muted
          onEnded={handleVideoEnd}
          style={{ overflow:"hidden" }}
        />
      ) : (
        <span>No corresponding video for "{words[currentIndex]}"</span>
      )}
    </div>
  );
};


export default VideoAnimate
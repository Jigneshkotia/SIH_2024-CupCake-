import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPageDesign.css";
import { Duo as DuoIcon, People as PeopleIcon, SignLanguage, TextSnippet } from "@mui/icons-material";

const LandingPage = () => {

  const navigate = useNavigate();

  const clickhandler = (sectionName)=>{
    navigate(`/${sectionName}`)
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div>
        <div className="logo">Deaf Connect</div>
        </div>
        <nav className="nav">
          <a href="#conversation-tools">Conversation Tools</a>
          <a href="#community">Community</a>
          <a href="#resources">Resources</a>
        </nav>
        <button className="learn" onClick={()=> clickhandler('learn')} >Learn ISL</button>
      </header>

      {/* Main Section */}
      <main className="main-content">
        <h1 className="main-heading">Empowering Deaf Communication</h1>
        <p className="subheading">
          Discover innovative tools and resources to facilitate seamless communication for the deaf community.
        </p>

        {/* Features Section */}
        <div className="features">
          <div className="feature" id="conversation-tools" onClick={()=> clickhandler('call')}>
            <div className="icon"><DuoIcon style={{ fontSize: "1.5em", marginTop:"10px" }} /></div>
            <h3>Conversation Tools</h3>
            <p>
              Explore our suite of communication tools designed to empower deaf individuals.
            </p>
          </div>
          <div className="feature" id="community" onClick={()=> clickhandler('texttosign')}>
            <div className="icon"><TextSnippet style={{ fontSize: "1.5em", marginTop:"10px" }} /></div>
            <h3>Text to Sign</h3>
            <p>
            Seamlessly Convert Text to Sign Language for Inclusive Conversations.
            </p>
          </div>
          <div className="feature" id="resources" onClick={()=> clickhandler('signtotext')}>
            <div className="icon"><SignLanguage style={{ fontSize: "1.5em", marginTop:"10px" }} /></div>
            <h3>Sign to Text</h3>
            <p>
            Transform Sign Language into Text for Effortless Communication and Inclusivity.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
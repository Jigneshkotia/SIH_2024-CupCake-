import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import SignToText from './pages/SignToText';
import TextToSign from './pages/TextToSign';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/texttosign' element={<TextToSign />}/>
        <Route path='/signtotext' element={<SignToText />}/>
        <Route path='/learn' element={<h1>This Page is not developed yet !!</h1>}/>
        <Route path='/call' element={<h1>This Page is not developed yet !!</h1>}/>
      </Routes>
    </Router>
  )
}

export default App

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useState } from 'react'
import './App.css'

const firebaseConfig = {
  apiKey: "AIzaSyANnzyiwPlEZU0X3EkeBANxfP6ukYR5pNY",
  authDomain: "projekt-e99a9.firebaseapp.com",
  projectId: "projekt-e99a9",
  storageBucket: "projekt-e99a9.firebasestorage.app",
  messagingSenderId: "1000920976054",
  appId: "1:1000920976054:web:6759684f27e45ec0173417"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {

  return (
    <div className='app'>
      <div className="info">
        truth nuke
        truth grenade
      </div>
     
      <div className="kep">
        <img src="https://www.shutterstock.com/image-photo/asphalt-road-goes-nuclear-explosion-600nw-2284503417.jpg" alt="" />
      </div>
    </div>
    
  )
}

export default App

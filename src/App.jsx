import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import { useState } from 'react'
import './App.css'
import { Button } from "@mui/material";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {

  return (
    <div className='app'>
      <div className="info">
        truth nuke
        truth grenade
        <Button variant="contained">Contained</Button>
      </div>
     
      <div className="kep">
        <img src="https://www.shutterstock.com/image-photo/asphalt-road-goes-nuclear-explosion-600nw-2284503417.jpg" alt="" />
      </div>
    </div>
    
  )
}

export default App

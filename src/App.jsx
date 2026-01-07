import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react'
import './App.css'
import Login from "./Login";
import { useEffect } from "react";

export default function App() {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  let [user, setUser] = useState({});

  useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, [])

  return (
    <div className='app'>
      <Login auth={auth} user={user} />

    </div>
  )
}



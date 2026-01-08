import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

import Login from "./Login";
import Register from "./Register";
import Chat from "./Chat";
import Profile from "./Profile";
import Users from "./Users";
import Navbar from "./Navbar";

// Firebase inicializálás
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Sötét mód állapota (alapértelmezett: sötét)
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Téma konfiguráció újraszámítása, ha a darkMode változik
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#54737D' : '#54737D', // Lila sötétben, kék világosban
      },
      secondary: {
        main: darkMode ? '#54737D' : '#54737D',
      },
      background: {
        default: darkMode ? '#0a1929' : '#e8ded4',
        paper: darkMode ? '#132f4c' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 12,
    },
  }), [darkMode]);

  if (loading) return <Box sx={{ color: 'white', textAlign: 'center', mt: 20 }}>Betöltés...</Box>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Átadjuk a darkMode-ot és a váltó függvényt a Navbarnak */}
        {user && <Navbar user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
        <Routes>
          <Route path="/login" element={!user ? <Login auth={auth} user={user} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Chat user={user} darkMode={darkMode} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} darkMode={darkMode} /> : <Navigate to="/login" />} />
          <Route path="/users" element={user ? <Users /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
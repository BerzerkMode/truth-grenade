import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './App';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Név azonnali beállítása
      await updateProfile(res.user, { displayName });
      navigate("/");
    } catch (err) {
      alert("Hiba a regisztráció során: " + err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Regisztráció</Typography>
        <form onSubmit={handleRegister}>
          <TextField fullWidth label="Felhasználónév" margin="normal" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
          <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField fullWidth label="Jelszó" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Létrehozás</Button>
        </form>
        <Typography sx={{ mt: 2, fontSize: '0.9rem' }}>
          Van már fiókod? <Link to="/login">Jelentkezz be!</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
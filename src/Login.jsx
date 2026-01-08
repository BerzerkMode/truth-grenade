import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Button, TextField, Typography, Paper, Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom'; // Ez a fontos a navigációhoz

export default function Login({ auth, user }) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loginError, setLoginError] = useState(false);
  let [errorText, setErrorText] = useState("");

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginError(false);
      setErrorText("");
      setEmail(""); setPassword("");
    } catch (err) {
      setLoginError(true);
      setErrorText("Hibás felhasználónév vagy jelszó");
    }
  }

  async function googleLogin() {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      {user ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Bejelentkezve: {user.email}</Typography>
          <Button variant='contained' color='error' onClick={logout} sx={{ mt: 2 }}>
            Kijelentkezés
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, width: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Bejelentkezés</Typography>
          
          <TextField
            error={loginError}
            helperText={errorText}
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            error={loginError}
            helperText={errorText}
            type='password'
            label="Jelszó"
            variant="outlined"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          <Button variant='contained' size='large' onClick={login} fullWidth>
            Belépés
          </Button>

          <Divider>VAGY</Divider>

          <Button variant='contained' size='large' onClick={googleLogin} color='success' fullWidth>
            Belépés Google-lel
          </Button>

          {/* ÚJ REGISZTRÁCIÓS LINK */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Nincs még fiókod? 
              <Link to="/register" style={{ marginLeft: '5px', color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Regisztrálj itt!
              </Link>
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
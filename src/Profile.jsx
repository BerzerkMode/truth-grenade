import React, { useState, useEffect } from 'react';
import { db } from './App';
import { updateProfile } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Paper, Typography, Avatar, Grid, Divider, Box, Button, TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

export default function Profile({ user, darkMode }) {
  const [stats, setStats] = useState({ sent: 0, received: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || "");

  // Statisztikák lekérése (küldött/kapott üzenetek száma)
  useEffect(() => {
    const fetchStats = async () => {
      const qSent = query(collection(db, "uzenetek"), where("kitol", "==", user.email));
      const qReceived = query(collection(db, "uzenetek"), where("kinek", "==", user.email));
      const sentSnap = await getDocs(qSent);
      const receivedSnap = await getDocs(qReceived);
      setStats({ sent: sentSnap.size, received: receivedSnap.size });
    };
    if (user?.email) fetchStats();
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile(user, { displayName: displayName });
      setIsEditing(false);
      alert("Sikeres névváltás!");
    } catch (error) {
      console.error(error);
      alert("Hiba történt a mentés során.");
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: 600, 
        borderRadius: 4,
        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
      }}>
        {/* Felső rész: Avatar és Név szerkesztése */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: 'primary.main', 
            mb: 2, 
            fontSize: '2.5rem',
            boxShadow: 3
          }}>
            {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
          </Avatar>

          {!isEditing ? (
            <>
              <Typography variant="h4" fontWeight="bold">
                {user.displayName || "Névtelen Felhasználó"}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)} 
                sx={{ mt: 1 }}
              >
                Profil szerkesztése
              </Button>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, width: '100%', justifyContent: 'center' }}>
              <TextField 
                size="small" 
                label="Új felhasználónév" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
              />
              <Button variant="contained" onClick={handleSave} color="primary">Mentés</Button>
              <Button variant="text" color="error" onClick={() => setIsEditing(false)}>Mégse</Button>
            </Box>
          )}
          <Typography color="textSecondary" sx={{ mt: 1 }}>{user.email}</Typography>
        </Box>

        {/* Statisztikai adatok */}
        <Grid container spacing={2} sx={{ mb: 4, textAlign: 'center' }}>
          <Grid item xs={6} sx={{ borderRight: '1px solid rgba(128,128,128,0.3)' }}>
            <Typography variant="h5" color="secondary">{stats.sent}</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>Küldött</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" color="secondary">{stats.received}</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>Kapott (privát)</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.6 }}>
            <InfoIcon fontSize="small" />
            <Typography variant="caption" fontWeight="bold">TECHNIKAI ADATOK</Typography>
          </Box>
        </Divider>

        {/* Technikai adatok szekció */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          p: 2,
          bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderRadius: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="caption" color="textSecondary">UID:</Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{user.uid}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="textSecondary">Regisztráció:</Typography>
            <Typography variant="caption">{user.metadata.creationTime}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="textSecondary">Utolsó belépés:</Typography>
            <Typography variant="caption">{user.metadata.lastSignInTime}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
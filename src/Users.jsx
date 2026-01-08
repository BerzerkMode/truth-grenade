import { useState, useEffect } from 'react';
import { db } from './App';
import { collection, onSnapshot } from "firebase/firestore";
import { List, ListItem, ListItemText, Paper, Typography, Avatar, ListItemAvatar, Box, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function Users() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "uzenetek"), (snapshot) => {
      const usersMap = new Map();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        
        // Küldő (kitol) feldolgozása
        if (data.kitol) {
          const existing = usersMap.get(data.kitol);
          // Csak akkor írjuk felül, ha van benne rendes név (felhasznalonev)
          if (!existing || (!existing.nev && data.felhasznalonev)) {
            usersMap.set(data.kitol, {
              email: data.kitol,
              nev: data.felhasznalonev || data.kitol.split('@')[0]
            });
          }
        }

        // Címzett (kinek) feldolgozása (ha nem 'mindenki')
        if (data.kinek && data.kinek !== "mindenki") {
          if (!usersMap.has(data.kinek)) {
            usersMap.set(data.kinek, {
              email: data.kinek,
              nev: data.kinek.split('@')[0] // Itt alapértelmezetten az email eleje, amíg ő nem ír
            });
          }
        }
      });

      // Tömbbé alakítjuk a megjelenítéshez
      setUserList(Array.from(usersMap.values()));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" /> Aktív Felhasználók
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Az alábbi felhasználók vettek részt eddig a beszélgetésekben:
        </Typography>
        <Divider />
        <List>
          {userList.length > 0 ? (
            userList.map((u, index) => (
              <ListItem key={index} divider={index !== userList.length - 1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {u.nev[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={u.nev} 
                  secondary={u.email} 
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ mt: 2, textAlign: 'center' }} color="textSecondary">
              Még nincsenek regisztrált üzenetváltások.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}
import { useState, useEffect, useRef } from 'react';
import { db } from './App';
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { 
  TextField, Button, List, ListItem, Paper, MenuItem, 
  Select, FormControl, InputLabel, Typography, Divider, Box, IconButton, Popover
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';

export default function Chat({ user, darkMode }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(""); 
  const [availableUsers, setAvailableUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Emoji választóhoz
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "uzenetek"), (snapshot) => {
      const usersMap = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.kitol && data.kitol !== user.email) {
          const nameToUse = data.felhasznalonev || data.kitol.split('@')[0];
          usersMap.set(data.kitol, { email: data.kitol, nev: nameToUse });
        }
        if (data.kinek && data.kinek !== "mindenki" && data.kinek !== user.email) {
          if (!usersMap.has(data.kinek)) {
            usersMap.set(data.kinek, { email: data.kinek, nev: data.kinek.split('@')[0] });
          }
        }
      });
      setAvailableUsers(Array.from(usersMap.values()));
    });
    return () => unsubscribeUsers();
  }, [user.email]);

  useEffect(() => {
    if (targetUser) {
      const q = query(collection(db, "uzenetek"), orderBy("mikor", "asc"));
      const unsubscribeMsg = onSnapshot(q, (snapshot) => {
        const allMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = allMsgs.filter(msg => 
          (msg.kitol === user.email && msg.kinek === targetUser) || 
          (msg.kitol === targetUser && msg.kinek === user.email)
        );
        setMessages(filtered);
      });
      return () => unsubscribeMsg();
    } else {
      setMessages([]);
    }
  }, [user.email, targetUser]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !targetUser) return;
    await addDoc(collection(db, "uzenetek"), {
      uzenet: newMessage,
      kitol: user.email,
      felhasznalonev: user.displayName || user.email.split('@')[0], 
      kinek: targetUser,
      mikor: new Date().toLocaleString('hu-HU')
    });
    setNewMessage("");
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const getBubbleStyle = (isOwn) => {
    if (darkMode) {
      return { backgroundColor: isOwn ? '#8A8077' : '#524944ff', color: '#ffffff' };
    } else {
      return { backgroundColor: isOwn ? '#C47F3E' : '#685C55', color: '#ffffff', border: isOwn ? 'none' : '1px solid #e0e0e0' };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: '20px auto', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 350 } }}>
          <InputLabel>Partner választása</InputLabel>
          <Select value={targetUser} label="Partner választása" onChange={(e) => setTargetUser(e.target.value)}>
            <MenuItem value="" disabled><em>Válassz valakit a beszélgetéshez...</em></MenuItem>
            {availableUsers.map(u => (
              <MenuItem key={u.email} value={u.email}>
                👤 {u.nev} <span style={{fontSize: '0.8rem', marginLeft: '8px', opacity: 0.7}}>({u.email})</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {targetUser ? (
        <>
          <List sx={{ flexGrow: 1, overflowY: 'auto', px: 1, mb: 2 }}>
            {messages.map(msg => {
              const isOwn = msg.kitol === user.email;
              const style = getBubbleStyle(isOwn);
              return (
                <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', padding: '4px 0' }}>
                  <Typography variant="caption" sx={{ mb: 0.5, mx: 1, opacity: 0.8 }}>
                    {isOwn ? 'Én' : (msg.felhasznalonev || msg.kitol.split('@')[0])} • {msg.mikor.split(' ')[3]}
                  </Typography>
                  <Paper elevation={1} sx={{ p: '10px 16px', backgroundColor: style.backgroundColor, color: style.color, borderRadius: isOwn ? '18px 18px 0px 18px' : '18px 18px 18px 0px', maxWidth: '85%', wordBreak: 'break-word', border: style.border || 'none' }}>
                    <Typography variant="body1">{msg.uzenet}</Typography>
                  </Paper>
                </ListItem>
              );
            })}
            <div ref={scrollRef} />
          </List>

          <form onSubmit={sendMessage} style={{ 
            display: 'flex', gap: '10px', alignItems: 'center',
            padding: '5px 10px', borderRadius: '25px',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#f0f2f5' 
          }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="primary">
              <EmojiEmotionsIcon />
            </IconButton>
            
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <EmojiPicker theme={darkMode ? 'dark' : 'light'} onEmojiClick={onEmojiClick} />
            </Popover>

            <TextField 
                fullWidth 
                size="small" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Írj egy üzenetet..." 
                variant="standard"
                InputProps={{ disableUnderline: true }}
            />
            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: '50%', minWidth: '48px', width: '48px', height: '48px', p: 0, boxShadow: 3 }}
            >
              <SendIcon />
            </Button>
          </form>
        </>
      ) : (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
          <Typography variant="h6">Nincs kiválasztott beszélgetés</Typography>
          <Typography variant="body2">Válassz egy partnert a fenti listából!</Typography>
        </Box>
      )}
    </Paper>
  );
}
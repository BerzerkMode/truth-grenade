import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box, Container, IconButton } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "./App";
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Navbar({ user, darkMode, setDarkMode }) {
  const location = useLocation();

  const getButtonStyle = (path) => ({
    color: '#fff', // A sötét barna és a világosabb barna felett is a fehér látszik jól
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    textTransform: 'none',
    fontSize: '1rem',
    opacity: location.pathname === path ? 1 : 0.8
  });

  return (
    <AppBar position="static" sx={{ 
      mb: 3, 
      // DINAMIKUS SZÍN: Sötét módban az eredeti #41302c, világosban egy kicsit világosabb barna vagy kék
      backgroundColor: darkMode ? '#132f4c' : '#5d4037', 
      backgroundImage: 'none',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, color: '#fff' }}>
             💬 Messenger
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/" sx={getButtonStyle('/')} startIcon={<ChatIcon />}>
              Chat
            </Button>
            <Button component={Link} to="/users" sx={getButtonStyle('/users')} startIcon={<PeopleIcon />}>
              Felhasználók
            </Button>
            <Button component={Link} to="/profile" sx={getButtonStyle('/profile')} startIcon={<PersonIcon />}>
              Profil
            </Button>
          </Box>

          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={() => setDarkMode(!darkMode)} 
              color="inherit"
              title={darkMode ? "Világos mód" : "Sötét mód"}
              sx={{ color: '#fff' }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Button 
                variant="outlined" 
                size="small" 
                onClick={() => signOut(auth)}
                startIcon={<LogoutIcon />}
                sx={{ 
                  ml: 1, 
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
            >
              Kilépés
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
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
    color: location.pathname === path ? '#fff' : 'rgba(255,255,255,0.7)',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    textTransform: 'none', // Barátságosabb kisbetűs/nagybetűs írásmód
    fontSize: '1rem'
  });

  return (
    <AppBar position="static" sx={{ 
      mb: 3, 
      backgroundColor: '#41302c', // A kért egyedi szín
      backgroundImage: 'none',     // Eltávolítjuk a Material UI alapértelmezett sötét módos textúráját
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
             💬 ChatApp
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
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Button 
                color="inherit" 
                variant="outlined" 
                size="small" 
                onClick={() => signOut(auth)}
                startIcon={<LogoutIcon />}
                sx={{ 
                  ml: 1, 
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
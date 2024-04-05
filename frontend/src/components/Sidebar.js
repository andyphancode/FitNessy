import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { useAuth } from '../context/AuthContext';


const drawerWidth = 240;

function Sidebar() {

  const { currentUser, logout } = useAuth();

  function loggedOut() {
    return (
      <List>
        <ListItem
          key="Home"
          component={Link}
          to={`/`}
          sx={{
            textDecoration: 'none', 
            color: 'inherit',
          }}
        >
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          <ListItemText primary={"Home"}/>
        </ListItem>
        {['Login', 'Register'].map((text, index) => (
          <ListItem key={text} component={Link} to={`/${text.toLowerCase()}`}
          sx={{
            textDecoration: 'none', 
            color: 'inherit',
            
          }}
          >
            <ListItemIcon>
              {index === 0 && <LoginIcon />}
              {index === 1 && <AppRegistrationIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    );
  };

  function loggedIn() {
    return (
      <List>
        <ListItem
          key="Home"
          component={Link}
          to={`/`}
          sx={{
            textDecoration: 'none', 
            color: 'inherit',
          }}
        >
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          <ListItemText primary={"Home"}/>
        </ListItem>
        <ListItem
          key="Workouts"
          component={Link}
          to={`/workouts`}
          sx={{
            textDecoration: 'none', 
            color: 'inherit',
          }}
        >
          <ListItemIcon>
            <FitnessCenterIcon/>
          </ListItemIcon>
          <ListItemText primary={"Workouts"}/>
        </ListItem>    
        <ListItem
          key="Logout"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer' // Makes it clear this is clickable
          }}
          onClick={logout} // Calls the logout function on click
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    );
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#bab8b4',
        },
      }}
      variant="permanent"
      anchor="left"
    >
        <Box
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
            }}
        >
        <img src={Logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '150px' }} />
        </Box>

        {currentUser ? loggedIn() : loggedOut()}
    </Drawer>
  );
}

export default Sidebar;
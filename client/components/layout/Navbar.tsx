'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useColorMode } from '@/lib/ThemeRegistry';
import Brightness4Icon from '@mui/icons-material/Brightness4';

export default function Navbar() {
  const { toggle } = useColorMode();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <AppBar
      position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          edge='start'
          // onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <LocalLibraryIcon />
        </IconButton>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          EMS
        </Typography>
        <IconButton color='inherit' onClick={toggle}>
          <Brightness4Icon />
        </IconButton>
        {user && (
          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.email[0].toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>{user.email}</MenuItem>
              <MenuItem disabled>{user.role}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

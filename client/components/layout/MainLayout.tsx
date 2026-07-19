'use client';

import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/auth-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return children;

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        minHeight: '100vh',
        flexGrow: 1,
        width: '100%',
        color: 'text.primary',
      }}
    >
      <Navbar />

      <Sidebar />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          ml: 0,
          transition: 'margin 0.2s',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

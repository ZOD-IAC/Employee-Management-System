'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { CircularProgress, Box } from '@mui/material';
import { useSnackbar } from '@/lib/snackbar-context';

function Redirector() {
  const router = useRouter();
  const { showError } = useSnackbar();

  useEffect(() => {
    api
      .get('/employee/profile/me')
      .then((res) => {
        router.replace(`/employees/${res.data.employee._id}`);
      })
      .catch((e) => {
        showError(e.response?.data?.message || 'Failed to load profile');
        router.replace('/login');
      });
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Redirector />
    </ProtectedRoute>
  );
}

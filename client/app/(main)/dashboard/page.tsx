'use client';

import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { useSnackbar } from '@/lib/snackbar-context';

interface Stats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentCount: number;
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useSnackbar();

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.stats))
      .catch((e) =>
        showError(e.response?.data?.message || 'Failed to load stats'),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { label: 'Total Employees', value: stats?.totalEmployees ?? 0 },
    { label: 'Active Employees', value: stats?.activeEmployees ?? 0 },
    { label: 'Inactive Employees', value: stats?.inactiveEmployees ?? 0 },
    { label: 'Departments', value: stats?.departmentCount ?? 0 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
              <CardContent>
                <Typography
                  color='text.secondary'
                  variant='body2'
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  {c.label}
                </Typography>
                <Typography variant='h3' sx={{ mt: 1 }}>
                  {c.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

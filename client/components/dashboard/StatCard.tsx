'use client';
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import { ReactNode } from 'react';

export default function StatCard({
  label,
  value,
  icon,
  color,
  loading,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: 'primary' | 'success' | 'warning' | 'info';
  loading?: boolean;
}) {
  const theme = useTheme();
  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction='row' />
        <Stack direction='row' spacing={2} alignItems='center'>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette[color].main, 0.12),
              color: theme.palette[color].main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box>
            {loading ? (
              <Skeleton width={40} height={28} />
            ) : (
              <Typography variant='h4'>{value}</Typography>
            )}
            <Typography variant='body2' color='text.secondary'>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

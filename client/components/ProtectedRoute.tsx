'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      const fallback = user.role === 'EMPLOYEE' ? '/profile' : '/dashboard';
      router.push(fallback);
    }
  }, [loading, user, allowedRoles, router]);

  if (loading || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

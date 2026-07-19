'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const INK = isDark ? '#E8E6E1' : '#14213D';
  const INK_LIGHT = isDark ? '#2A2E38' : '#1B3358';
  const GOLD = '#C9A227';
  const STEEL = isDark ? '#9AA3B0' : '#5B6472';
  const PAGE_BG = isDark ? '#0F1117' : '#FAFAF8';
  const PANEL_BG = isDark ? '#1a1d24' : INK;
  const BORDER = isDark ? '#333844' : '#E2E0DA';

  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      color: INK,
      '& fieldset': { borderColor: BORDER },
      '&:hover fieldset': { borderColor: STEEL },
      '&.Mui-focused fieldset': { borderColor: GOLD, borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: GOLD },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: PAGE_BG }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '44%',
          bgcolor: PANEL_BG,
          backgroundImage: isDark
            ? 'none'
            : `linear-gradient(160deg, ${INK} 0%, ${INK_LIGHT} 100%)`,
          color: '#FAFAF8',
          p: 6,
        }}
      >
        {/* ...unchanged left panel content... */}
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 26, color: INK }}>
            Sign in
          </Typography>
          <Typography sx={{ color: STEEL, fontSize: 14, mt: 0.5, mb: 4 }}>
            Enter your credentials to access your account.
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2.5, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 0.75 }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder='you@company.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ ...fieldSx, mb: 2.5 }}
            />

            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 0.75 }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge='end'
                        size='small'
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize='small' />
                        ) : (
                          <Visibility fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type='submit'
              fullWidth
              disabled={loading}
              sx={{
                mt: 3.5,
                py: 1.3,
                bgcolor: INK,
                color: isDark ? '#0F1117' : '#FAFAF8',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: 15,
                '&:hover': { bgcolor: INK_LIGHT },
                '&:disabled': { bgcolor: '#B8BCC4' },
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

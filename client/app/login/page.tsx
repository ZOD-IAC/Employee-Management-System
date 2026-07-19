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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '@/lib/auth-context';

const INK = '#14213D';
const INK_LIGHT = '#1B3358';
const GOLD = '#C9A227';
const STEEL = '#5B6472';

// Org-node signature graphic — echoes the reporting-tree feature
function NodeGraph() {
  const nodes = [
    { x: 160, y: 40 },
    { x: 70, y: 130 },
    { x: 160, y: 130 },
    { x: 250, y: 130 },
    { x: 30, y: 220 },
    { x: 100, y: 220 },
    { x: 220, y: 220 },
    { x: 290, y: 220 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
    [1, 5],
    [3, 6],
    [3, 7],
  ];
  return (
    <svg
      viewBox='0 0 320 260'
      width='100%'
      height='100%'
      style={{ maxWidth: 340 }}
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke='rgba(201,162,39,0.35)'
          strokeWidth='1.5'
        >
          <animate
            attributeName='stroke'
            values='rgba(201,162,39,0.15);rgba(201,162,39,0.5);rgba(201,162,39,0.15)'
            dur={`${3 + i * 0.4}s`}
            repeatCount='indefinite'
          />
        </line>
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 0 ? 7 : 5}
          fill={i === 0 ? GOLD : '#FAFAF8'}
          stroke={GOLD}
          strokeWidth='1.5'
          opacity={i === 0 ? 1 : 0.85}
        />
      ))}
    </svg>
  );
}

export default function LoginPage() {
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
      '& fieldset': { borderColor: '#E2E0DA' },
      '&:hover fieldset': { borderColor: STEEL },
      '&.Mui-focused fieldset': { borderColor: GOLD, borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: GOLD },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAFAF8' }}>
      {/* Left panel — brand + signature */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '44%',
          bgcolor: INK,
          backgroundImage: `linear-gradient(160deg, ${INK} 0%, ${INK_LIGHT} 100%)`,
          color: '#FAFAF8',
          p: 6,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 0.5,
            }}
          >
            EMS
          </Typography>
          <Typography
            sx={{ color: 'rgba(250,250,248,0.55)', fontSize: 13, mt: 0.5 }}
          >
            Employee Management System
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <NodeGraph />
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 26,
              lineHeight: 1.3,
              maxWidth: 340,
            }}
          >
            Structure, visibility, and control — in one place.
          </Typography>
          <Typography
            sx={{
              color: 'rgba(250,250,248,0.5)',
              fontSize: 13.5,
              mt: 2,
              maxWidth: 320,
            }}
          >
            Manage records, reporting lines, and access across your
            organization.
          </Typography>
        </Box>
      </Box>

      {/* Right panel — form */}
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
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 26,
              color: INK,
            }}
          >
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
                color: '#FAFAF8',
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

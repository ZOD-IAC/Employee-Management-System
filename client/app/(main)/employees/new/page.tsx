'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { useSnackbar } from '@/lib/snackbar-context';

interface FormState {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
  salary: string;
  joiningDate: string;
  role: string;
}

const initialState: FormState = {
  employeeId: '',
  name: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  designation: '',
  salary: '',
  joiningDate: '',
  role: 'EMPLOYEE',
};

function CreateEmployeeContent() {
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post('/employee', { ...form, salary: Number(form.salary) });
      showSuccess('Employee created successfully');
      router.push('/employees');
    } catch (e: any) {
      showError(e.response?.data?.message || 'Failed to create employee');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Add Employee
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label='Name'
            value={form.name}
            onChange={handleChange('name')}
            required
          />
          <TextField
            label='Email'
            type='email'
            value={form.email}
            onChange={handleChange('email')}
            required
          />
          <TextField
            label='Password'
            type='password'
            value={form.password}
            onChange={handleChange('password')}
            required
            helperText='Min 6 characters'
          />
          <TextField
            label='Phone'
            value={form.phone}
            onChange={handleChange('phone')}
            required
          />
          <TextField
            label='Department'
            value={form.department}
            onChange={handleChange('department')}
            required
          />
          <TextField
            label='Designation'
            value={form.designation}
            onChange={handleChange('designation')}
            required
          />
          <TextField
            label='Salary'
            type='number'
            value={form.salary}
            onChange={handleChange('salary')}
            required
          />
          <TextField
            label='Joining Date'
            type='date'
            value={form.joiningDate}
            onChange={handleChange('joiningDate')}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            required
          />
          <TextField
            select
            label='Role'
            value={form.role}
            onChange={handleChange('role')}
          >
            <MenuItem value='EMPLOYEE'>Employee</MenuItem>
            <MenuItem value='HR_MANAGER'>HR Manager</MenuItem>
            <MenuItem value='SUPER_ADMIN'>Super Admin</MenuItem>
          </TextField>
          <Stack direction='row' spacing={2}>
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Create'}
            </Button>
            <Button onClick={() => router.push('/employees')}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default function CreateEmployeePage() {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
      <CreateEmployeeContent />
    </ProtectedRoute>
  );
}

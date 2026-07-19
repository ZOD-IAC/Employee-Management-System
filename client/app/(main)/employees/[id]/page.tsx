'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { useSnackbar } from '@/lib/snackbar-context';
import { useAuth } from '@/lib/auth-context';
import { Employee } from '@/lib/types';

function EmployeeDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();
  const { user } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdminOrHR =
    user?.role === 'SUPER_ADMIN' || user?.role === 'HR_MANAGER';
  const isSelf =
    employee &&
    (typeof employee.authId === 'object'
      ? employee.authId._id === user?.id
      : false);

  useEffect(() => {
    api
      .get(`/employee/${id}`)
      .then((res) => setEmployee(res.data.employee))
      .catch((e) =>
        showError(e.response?.data?.message || 'Failed to load employee'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange =
    (field: keyof Employee) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmployee((emp) => (emp ? { ...emp, [field]: e.target.value } : emp));
    };

  const handleSave = async () => {
    if (!employee) return;
    setSaving(true);
    try {
      // Employee self-update: only limited fields via /profile route
      if (!isAdminOrHR && isSelf) {
        await api.patch(`/employee/${id}/profile`, {
          phone: employee.phone,
          department: employee.department,
        });
      } else {
        await api.put(`/employee/${id}`, {
          name: employee.name,
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
          salary: employee.salary,
          status: employee.status,
        });
      }
      showSuccess('Updated successfully');
      router.push('/employees');
    } catch (e: any) {
      showError(e.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employee/${id}`);
      showSuccess('Employee deleted');
      router.push('/employees');
    } catch (e: any) {
      showError(e.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!employee) return null;

  const readOnly = !isAdminOrHR && !isSelf;

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Employee Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField label='Employee ID' value={employee.employeeId} disabled />
          <TextField
            label='Name'
            value={employee.name}
            onChange={handleChange('name')}
            disabled={readOnly || !isAdminOrHR}
          />
          <TextField label='Email' value={employee.email} disabled />
          <TextField
            label='Phone'
            value={employee.phone}
            onChange={handleChange('phone')}
            disabled={readOnly}
          />
          <TextField
            label='Department'
            value={employee.department}
            onChange={handleChange('department')}
            disabled={readOnly}
          />
          <TextField
            label='Designation'
            value={employee.designation}
            onChange={handleChange('designation')}
            disabled={readOnly || !isAdminOrHR}
          />
          <TextField
            label='Salary'
            type='number'
            value={employee.salary}
            onChange={handleChange('salary') as any}
            disabled={readOnly || !isAdminOrHR}
          />
          {isAdminOrHR && (
            <TextField
              select
              label='Status'
              value={employee.status}
              onChange={handleChange('status') as any}
            >
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
            </TextField>
          )}
          <Stack direction='row' spacing={2}>
            {(isAdminOrHR || isSelf) && (
              <Button
                variant='contained'
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            )}
            {user?.role === 'SUPER_ADMIN' && (
              <Button color='error' onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button onClick={() => router.push('/employees')}>Back</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default function EmployeeDetailPage() {
  return (
    <ProtectedRoute>
      <EmployeeDetailContent />
    </ProtectedRoute>
  );
}

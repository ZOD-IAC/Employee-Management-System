'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Button,
  Chip,
  TableSortLabel,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { useSnackbar } from '@/lib/snackbar-context';
import { useAuth } from '@/lib/auth-context';
import { Employee } from '@/lib/types';

function EmployeeListContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'joiningDate'>('joiningDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { showError } = useSnackbar();
  const { user } = useAuth();
  const router = useRouter();

  const canCreate = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employee', {
          params: {
            page: page + 1,
            limit,
            search: search || undefined,
            department: department || undefined,
            status: status || undefined,
            sortBy,
            order,
          },
        });
        setEmployees(res.data.employees);
        setTotal(res.data.total);
      } catch (e: any) {
        showError(e.response?.data?.message || 'Failed to load employees');
      }
    };

    fetchEmployees();
  }, [page, limit, search, department, status, sortBy, order]);

  const handleSort = (field: 'name' | 'joiningDate') => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4'>Employees</Typography>
        {canCreate && (
          <div>
            <Button
              variant='contained'
              onClick={() => router.push('/employees/new')}
            >
              Add Employee
            </Button>
            <Button
              variant='outlined'
              onClick={() => router.push('/employees/import')}
            >
              Import CSV
            </Button>
          </div>
        )}
      </Box>

      <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
        <TextField
          label='Search name/email'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size='small'
        />
        <TextField
          label='Department'
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(0);
          }}
          size='small'
        />
        <TextField
          select
          label='Status'
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          size='small'
          sx={{ minWidth: 140 }}
        >
          <MenuItem value=''>All</MenuItem>
          <MenuItem value='ACTIVE'>Active</MenuItem>
          <MenuItem value='INACTIVE'>Inactive</MenuItem>
        </TextField>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'joiningDate'}
                  direction={sortBy === 'joiningDate' ? order : 'asc'}
                  onClick={() => handleSort('joiningDate')}
                >
                  Joining Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow
                key={emp._id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/employees/${emp._id}`)}
              >
                <TableCell>{emp.employeeId}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.designation}</TableCell>
                <TableCell>
                  {new Date(emp.joiningDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={emp.status}
                    color={emp.status === 'ACTIVE' ? 'success' : 'default'}
                    size='small'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>
    </Box>
  );
}

export default function EmployeeListPage() {
  return (
    <ProtectedRoute>
      <EmployeeListContent />
    </ProtectedRoute>
  );
}

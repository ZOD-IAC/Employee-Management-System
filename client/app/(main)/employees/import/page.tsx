'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { useSnackbar } from '@/lib/snackbar-context';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ImportResult {
  success: number;
  failed: { email: string; reason: string }[];
}

function ImportContent() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/employee/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult({ success: res.data.success, failed: res.data.failed });
      showSuccess('Import completed');
    } catch (e: any) {
      showError(e.response?.data?.message || 'Import failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Import Employees (CSV)
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Alert severity='info' sx={{ mb: 2 }}>
          Expected columns: employeeId, name, email, phone, department,
          designation, salary, joiningDate, role, password
        </Alert>

        <Stack spacing={2}>
          <Button
            component='label'
            variant='outlined'
            startIcon={<CloudUploadIcon />}
          >
            Choose CSV
            <VisuallyHiddenInput
              type='file'
              accept='.csv'
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setFile(selectedFile);
              }}
            />
          </Button>

          {file && (
            <Typography variant='body2'>Selected: {file.name}</Typography>
          )}

          <Button
            variant='contained'
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? <CircularProgress size={20} /> : 'Upload & Import'}
          </Button>
        </Stack>

        {result && (
          <Box sx={{ mt: 3 }}>
            <Alert severity='success' sx={{ mb: 1 }}>
              {result.success} employee(s) imported successfully
            </Alert>
            {result.failed.length > 0 && (
              <>
                <Alert severity='warning' sx={{ mb: 1 }}>
                  {result.failed.length} row(s) failed
                </Alert>
                <List dense>
                  {result.failed.map((f, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={f.email || '(no email)'}
                        secondary={f.reason}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default function ImportPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
      <ImportContent />
    </ProtectedRoute>
  );
}

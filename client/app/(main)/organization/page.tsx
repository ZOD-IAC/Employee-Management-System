'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/axios';
import { useSnackbar } from '@/lib/snackbar-context';

interface TreeNode {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  children: TreeNode[];
}

function TreeNodeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const router = useRouter();

  return (
    <Box sx={{ ml: depth * 4, mt: 1.5 }}>
      <Paper
        variant='outlined'
        sx={{
          p: 2,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          borderRadius: 2,
          borderColor: 'divider',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
        }}
        onClick={() => router.push(`/employees/${node._id}`)}
      >
        <Avatar
          sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}
        >
          {node.name[0]}
        </Avatar>
        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
          {node.name}
        </Typography>
        <Chip
          label={node.designation}
          size='small'
          color='primary'
          variant='outlined'
        />
        <Typography variant='body2' color='text.secondary'>
          {node.department}
        </Typography>
      </Paper>

      {node.children?.length > 0 && (
        <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', ml: 2 }}>
          {node.children.map((child) => (
            <TreeNodeItem key={child._id} node={child} depth={1} />
          ))}
        </Box>
      )}
    </Box>
  );
}

function OrganizationContent() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useSnackbar();

  useEffect(() => {
    api
      .get('/organization/tree')
      .then((res) => setTree(res.data.tree))
      .catch((e) =>
        showError(
          e.response?.data?.message || 'Failed to load organization tree',
        ),
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Organization Tree
      </Typography>
      {tree.length === 0 ? (
        <Typography color='text.secondary'>No employees found.</Typography>
      ) : (
        <Stack>
          {tree.map((root) => (
            <TreeNodeItem key={root._id} node={root} depth={0} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function OrganizationPage() {
  return (
    <ProtectedRoute>
      <OrganizationContent />
    </ProtectedRoute>
  );
}

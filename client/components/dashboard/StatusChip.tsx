import Chip from '@mui/material/Chip';
// import type { Status } from '@/types';

export function StatusChip({ status }: { status: any }) {
  const isActive = status === 'ACTIVE';
  return (
    <Chip
      size='small'
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
      sx={{
        borderRadius: 1,
        fontSize: 11,
        height: 22,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    />
  );
}

export default StatusChip;

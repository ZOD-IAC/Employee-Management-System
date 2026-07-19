import Chip from '@mui/material/Chip';
// import type { Role } from '@/types';

const config: Record<
  any,
  { label: string; color: 'primary' | 'secondary' | 'default' }
> = {
  ADMIN: { label: 'Admin', color: 'primary' },
  MANAGER: { label: 'HR_Manager', color: 'secondary' },
  EMPLOYEE: { label: 'Employee', color: 'default' },
};

export function RoleChip({ role }: { role: any }) {
  const c = config[role];
  return (
    <Chip
      size='small'
      variant='outlined'
      color={c.color}
      label={c.label}
      sx={{ borderRadius: 1, height: 22, fontSize: 11 }}
    />
  );
}

export default RoleChip;

'use client';

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const DRAWER_WIDTH = 240;

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    roles: ['SUPER_ADMIN', 'HR_MANAGER'],
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: <PeopleIcon />,
    roles: ['SUPER_ADMIN', 'HR_MANAGER'],
  },
  {
    label: 'Organization',
    path: '/organization',
    icon: <AccountTreeIcon />,
    roles: ['SUPER_ADMIN', 'HR_MANAGER'],
  },
  {
    label: 'My Profile',
    path: '/profile',
    icon: <PeopleIcon />,
    roles: ['HR_MANAGER', 'EMPLOYEE'],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const items = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <Drawer
      variant='persistent'
      open={true}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => {
              router.push(item.path);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

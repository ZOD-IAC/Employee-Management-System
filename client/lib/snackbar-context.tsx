'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarContextType {
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    open: boolean;
    msg: string;
    severity: 'error' | 'success';
  }>({
    open: false,
    msg: '',
    severity: 'error',
  });

  const showError = (msg: string) =>
    setState({ open: true, msg, severity: 'error' });
  const showSuccess = (msg: string) =>
    setState({ open: true, msg, severity: 'success' });

  return (
    <SnackbarContext.Provider value={{ showError, showSuccess }}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={() => setState((s) => ({ ...s, open: false }))}
      >
        <Alert severity={state.severity}>{state.msg}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
};

'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export const Unauthenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

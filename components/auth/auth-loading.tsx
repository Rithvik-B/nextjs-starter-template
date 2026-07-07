'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export const AuthLoading = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (!isLoading) {
    return null;
  }

  return <>{children}</>;
};

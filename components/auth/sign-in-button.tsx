'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

interface SignInButtonProps {
  children?: React.ReactNode;
  mode?: 'modal' | 'redirect';
}

export const SignInButton = ({ children, mode = 'modal' }: SignInButtonProps) => {
  const { openLoginModal } = useAuth();

  const handleClick = () => {
    if (mode === 'modal') {
      openLoginModal();
    } else {
      // In redirect mode we could go to a custom /login route, 
      // but for this SPA setup, triggering the modal is the cleanest.
      openLoginModal();
    }
  };

  if (children) {
    // If children is a valid React element, we clone it and add onClick.
    // Otherwise, we wrap it in a span with onClick.
    if (React.isValidElement(children)) {
      const element = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
      return React.cloneElement(element, {
        onClick: (e: React.MouseEvent) => {
          if (element.props.onClick) element.props.onClick(e);
          handleClick();
        },
      });
    }
    return <span onClick={handleClick}>{children}</span>;
  }

  return (
    <Button onClick={handleClick} variant="ghost" size="sm">
      Log in
    </Button>
  );
};

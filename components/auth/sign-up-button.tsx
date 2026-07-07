'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

interface SignUpButtonProps {
  children?: React.ReactNode;
  mode?: 'modal' | 'redirect';
}

export const SignUpButton = ({ children, mode = 'modal' }: SignUpButtonProps) => {
  const { openSignupModal } = useAuth();

  const handleClick = () => {
    if (mode === 'modal') {
      openSignupModal();
    } else {
      openSignupModal();
    }
  };

  if (children) {
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
    <Button onClick={handleClick} size="sm">
      Get started free
    </Button>
  );
};

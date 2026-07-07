'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { X, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';



export const AuthModal = () => {
  const { isModalOpen, modalMode, login, register, closeAuthModal } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(modalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync internal mode state with context state when it opens
  useEffect(() => {
    if (isModalOpen) {
      Promise.resolve().then(() => {
        setMode(modalMode);
        setErrorMsg(null);
        // Reset inputs
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      });
    }
  }, [isModalOpen, modalMode]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        setErrorMsg('Name is required.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setErrorMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : closeAuthModal}
      />
      
      {/* Content */}
      <div className="relative bg-background border border-border/80 w-full max-w-md p-8 rounded-2xl shadow-2xl z-50 flex flex-col items-center gap-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-secondary disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Greeting */}
        <div className="flex flex-col items-center gap-y-2 text-center">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Enter your credentials to sign in' : 'Get started with your new account'}
          </p>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="flex items-center gap-x-2 bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 text-destructive text-sm p-3 rounded-lg w-full">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4">
          
          {/* Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button type="submit" disabled={loading} className="w-full mt-2 h-10">
            {loading ? (
              <span className="flex items-center gap-x-2 justify-center">
                <Spinner size="default" />
                Processing...
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Register'
            )}
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="text-sm text-center text-muted-foreground">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                disabled={loading}
                className="font-semibold text-primary underline hover:text-primary/95 transition-colors"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                disabled={loading}
                className="font-semibold text-primary underline hover:text-primary/95 transition-colors"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

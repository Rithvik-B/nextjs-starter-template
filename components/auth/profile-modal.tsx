'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { X, User as UserIcon, Lock, ShieldCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileModal = () => {
  const { isProfileModalOpen, user, closeProfileModal, updateProfile, changePassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Profile form state
  const [name, setName] = useState('');
  
  // Password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync user name when modal opens
  useEffect(() => {
    if (isProfileModalOpen && user) {
      Promise.resolve().then(() => {
        setName(user.name || '');
        setActiveTab('profile');
        setErrorMsg(null);
        setSuccessMsg(null);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      });
    }
  }, [isProfileModalOpen, user]);

  if (!isProfileModalOpen || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(name);
      setSuccessMsg('Profile updated successfully!');
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccessMsg('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to change password. Make sure current password is correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : closeProfileModal}
      />
      
      {/* Modal Container */}
      <div className="relative bg-background border border-border/80 w-full max-w-2xl rounded-2xl shadow-2xl z-50 flex flex-col md:flex-row h-#550px overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={closeProfileModal}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-secondary z-50 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Sidebar Nav */}
        <div className="w-full md:w-56 bg-secondary/30 dark:bg-secondary/10 border-b md:border-b-0 md:border-r border-border/60 p-6 flex flex-col gap-y-6">
          <div>
            <h3 className="font-bold text-lg leading-none">Account Settings</h3>
            <p className="text-xs text-muted-foreground mt-1">Manage your details & security</p>
          </div>
          
          <div className="flex flex-row md:flex-col gap-2">
            <button
              onClick={() => { setActiveTab('profile'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-all w-full text-left justify-start cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => { setActiveTab('security'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-all w-full text-left justify-start cursor-pointer ${
                activeTab === 'security' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Security</span>
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {activeTab === 'profile' ? 'Profile Details' : 'Change Password'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activeTab === 'profile' 
                ? 'Update your personal info and email settings.' 
                : 'Choose a secure password to protect your account.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="flex items-center gap-x-2 bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 text-destructive text-sm p-3 rounded-lg w-full">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-x-2 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm p-3 rounded-lg w-full">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="font-medium">{successMsg}</p>
            </div>
          )}

          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-y-4 flex-1">
              {/* Email (Read Only) */}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-secondary/20 border border-border/40 text-muted-foreground/80 rounded-lg py-2 pl-10 pr-4 text-sm outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">Email address cannot be changed.</p>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-auto pt-4 border-t border-border/50 flex justify-end">
                <Button type="submit" disabled={loading} className="px-5 h-9">
                  {loading ? (
                    <span className="flex items-center gap-x-2">
                      <Spinner size="default" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Tab 2: Security */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-y-4 flex-1">
              {/* Current Password */}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="New password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary/40 border border-border/60 hover:border-border focus:border-primary focus:bg-background rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-auto pt-4 border-t border-border/50 flex justify-end">
                <Button type="submit" disabled={loading} className="px-5 h-9">
                  {loading ? (
                    <span className="flex items-center gap-x-2">
                      <Spinner size="default" />
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

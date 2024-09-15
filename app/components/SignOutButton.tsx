// components/SignOutButton.tsx
'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut(undefined, { redirectTo: '/loggedout' });
      }}>
      <button type='submit' style={styles.signOutButton}>Sign Out</button>
    </form>
  );
}

const styles = {
  signOutButton: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#FF3B30',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    zIndex: 1000,
  },
};

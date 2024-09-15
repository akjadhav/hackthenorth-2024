import React from 'react';
import { signIn } from '../../auth';

function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(undefined, { redirectTo: '/loggedin' });
      }}
    >
      <button type='submit' style={styles.signInButton}>
        Get Started
      </button>
    </form>
  );
}

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to PathSense</h1>
        <p style={styles.subtitle}>Navigate your world with precision and ease</p>
        <SignIn />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to right, #4A90E2, #50E3C2)',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    textAlign: 'center' as const,
    color: '#FFFFFF',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '40px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  signInButton: {
    padding: '14px 28px',
    fontSize: '18px',
    color: '#4A90E2',
    backgroundColor: '#FFFFFF',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};
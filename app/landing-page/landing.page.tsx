import { signIn } from '../../auth';

function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(undefined, { redirectTo: '/loggedin' });
      }}>
      <button type='submit' style={styles.signInButton}>Sign In</button>
    </form>
  );
}

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to PathSense</h1>
      <SignIn />
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
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: '36px',
    color: '#007AFF',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  signInButton: {
    padding: '12px 24px',
    fontSize: '18px',
    color: '#fff',
    backgroundColor: '#007AFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
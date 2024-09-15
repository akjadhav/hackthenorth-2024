import { signIn } from '../../auth';

function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(undefined, { redirectTo: '/loggedin' });
      }}>
      <button type='submit'>Start.</button>
    </form>
  );
}

export default function LandingPage() {
  return (
    <div>
      <h1>PageSense</h1>
      {/* <SignIn /> */}
      <button type='submit'>Start.</button>
    </div>
  );
}

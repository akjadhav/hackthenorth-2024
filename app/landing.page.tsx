import { signIn } from '../../auth';

export function SignIn() {
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

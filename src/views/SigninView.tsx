import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function SigninView() {
  const { session, signInUser } = useAuth();
  const [errorMessage, submitAction, isPending] = useActionState(
    handleSignIn,
    null,
  );

  async function handleSignIn(
    _previousError: string | null,
    formData: FormData,
  ): Promise<string | null> {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || email.trim() === '') {
      return 'Please enter the email.';
    }

    if (typeof password !== 'string' || password.trim() === '') {
      return 'Please enter the password.';
    }

    try {
      const { data, error: signInError } = await signInUser(
        email.trim(),
        password,
      );

      if (signInError) {
        return signInError.message;
      }

      console.log('Supabase sign-in success. User:', data.user);

      return null;
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
      return 'Failed to sign in. Please try again.';
    }
  }

  if (session === undefined) {
    return (
      <div className="p-4 text-lg font-medium text-amber-700">Loading...</div>
    );
  }

  return (
    <>
      <section className="p-4 text-center text-4xl font-medium text-emerald-600">
        <h1>Welcome to the Sales Lab</h1>
      </section>

      <section className="mx-auto w-full max-w-2xl space-y-6 sm:p-8 rounded-lg bg-white p-4 shadow-md">
        <form action={submitAction}>
          <h2 className="text-xl text-gray-800">Sign In</h2>
          <p className="text-sm text-gray-600">
            Don´t have an account yet?
            <Link to="/sing-up" className="hover:text-gray-800 hover:border-b">
              {' '}
              Sign up
            </Link>
          </p>

          <div className="mt-8 flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="employee@aps.com"
              className="mt-2 rounded border p-2"
              disabled={isPending}
            />
          </div>

          <div className="mt-4 flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Write your password"
              className="mt-2 rounded border p-2"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-4 min-w-full cursor-pointer rounded bg-emerald-600 p-2 text-white hover:bg-emerald-700"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>

          {errorMessage && (
            <div
              id="signin-error"
              role="alert"
              className="text-sm text-red-600 sm:col-span-3"
            >
              {errorMessage}
            </div>
          )}
        </form>
      </section>
    </>
  );
}

export default SigninView;

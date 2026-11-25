import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const SigninView = () => {
  const { session, signInUser } = useAuth();
  const [error, submitAction, isPending] = useActionState<
    string | null,
    FormData
  >(async (_previousState, formData) => {
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

      console.log('Supabase sign-in success. User:', data.session);

      return null;
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
      return 'Failed to sign in. Please try again.';
    }
  }, null);

  if (session === undefined) {
    return (
      <div className="p-4 text-amber-700 text-lg font-medium">Loading...</div>
    );
  }

  return (
    <>
      <section className="text-center p-4 text-emerald-600 text-4xl font-medium">
        <h1 className="">Welcome to the Sales Lab</h1>
      </section>

      {/* {session && (
        <p role="status" className="text-center text-emerald-700">
          Signed in as {session.user.email ?? session.user.id}
        </p>
      )} */}

      <section className="mt-4 bg-white m-4 p-4 rounded-lg shadow-md">
        <form action={submitAction}>
          <h2 className="text-gray-800 text-xl">Sign In</h2>
          <p className="text-gray-600 text-sm">
            Don´t have an account yet?
            <Link to="/sing-up" className="hover:text-gray-800 hover:border-b">
              {' '}
              Sign up
            </Link>
          </p>

          <div className="flex flex-col mt-8">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="employee@aps.com"
              className="border rounded mt-2 p-2"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Write your password"
              className="border rounded mt-2 p-2 "
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="min-w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4 p-2 rounded cursor-pointer"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>

          {error && (
            <div
              id="signin-error"
              role="alert"
              className="text-sm text-red-600 sm:col-span-3"
            >
              {error}
            </div>
          )}
        </form>
      </section>
    </>
  );
};

export default SigninView;

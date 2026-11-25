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

    const { data, error: signInError } = await signInUser(email, password);

    if (signInError) throw signInError;

    if (data?.session) return null;

    console.log('User:', { email, password });

    return null;
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
              placeholder="Write your password"
              className="border rounded mt-2 p-2 "
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            className="min-w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4 p-2 rounded cursor-pointer"
          >
            {isPending ? 'Signin in...' : 'Sign in'}
          </button>

          {error && (
            <div
              id="deal-error"
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

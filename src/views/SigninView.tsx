import { useActionState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function SigninView() {
  const { session, signInUser } = useAuth();
  const navigate = useNavigate();
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

      if (!data.session) {
        return 'Sign-in did not create a session. Please try again.';
      }

      console.log('Supabase sign-in success. User:', data.user);

      await navigate('/dashboard', { replace: true });
      return null;
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
      return 'Failed to sign in. Please try again.';
    }
  }

  if (session === undefined) {
    return (
      <main className="min-h-dvh bg-gray-50 px-4 py-10 sm:px-6 sm:py-16">
        <p role="status" className="text-center text-base text-gray-600">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-emerald-700 sm:text-4xl">
            Welcome to the Sales Lab
          </h1>
          <p className="mt-3 text-base leading-6 text-gray-600">
            Sign in to your sales dashboard.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <form
            action={submitAction}
            aria-labelledby="signin-title"
            aria-describedby={errorMessage ? 'signin-error' : undefined}
            aria-busy={isPending}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2
                id="signin-title"
                className="text-2xl font-semibold text-gray-900"
              >
                Sign in
              </h2>
              <p className="text-sm leading-6 text-gray-600">
                Don't have an account yet?{' '}
                <Link
                  to="/sing-up"
                  className="rounded-sm font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="employee@aps.com"
                className="min-h-12 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="min-h-12 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="min-h-12 w-full cursor-pointer rounded-lg bg-emerald-600 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>

            {errorMessage && (
              <div
                id="signin-error"
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 wrap-break-word text-red-700"
              >
                {errorMessage}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

export default SigninView;

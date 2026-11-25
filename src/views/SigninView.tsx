import { useAuth } from '../context/useAuth';

const SigninView = () => {
  const { session } = useAuth();

  if (session === undefined) {
    return (
      <div className="p-4 text-amber-700 text-lg font-medium">Loading...</div>
    );
  }

  return (
    <div className="text-center p-4 text-emerald-600 text-4xl font-medium">
      {session ? 'You are signed in.' : 'Please sign in.'}
    </div>
  );
};

export default SigninView;

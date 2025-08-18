import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { useToast } from '../../hooks/useToast';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const { push } = useToast();
  const auth = app ? getAuth(app) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    if (!auth) {
      push('OAuth currently unavailable. Please use email/password.', 'info');
      return;
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const idToken = await resultsFromGoogle.user.getIdToken();
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok && data && data.user && data.token) {
        dispatch(signInSuccess({ user: data.user, token: data.token }));
        navigate('/');
      } else {
        push(data.message || 'Google sign-in failed', 'error');
      }
    } catch (error) {
      console.log(error);
      push('Google sign-in aborted or failed', 'error');
    }
  };
  return (
    <Button
      type='button'
      gradientDuoTone='greenToBlue'
      outline
      onClick={handleGoogleClick}
      disabled={!auth}
      title={!auth ? 'OAuth disabled until Firebase is reactivated' : 'Sign in with Google'}
    >
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      {auth ? 'Continue with Google' : 'Google OAuth Unavailable'}
    </Button>
  );
}

import { Alert, Button, Label, Spinner, TextInput, Select } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../common/OAuth';
import { useToast } from '../../hooks/useToast';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [pwdScore, setPwdScore] = useState(0);
  const [pwdLabel, setPwdLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { push } = useToast();
  const computePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { score, label: labels[score] };
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    const trimmed = value.trim();
    setFormData({ ...formData, [id]: trimmed });
    if (id === 'password') {
      const { score, label } = computePasswordStrength(value);
      setPwdScore(score);
      setPwdLabel(label);
    }
  };
  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePassword = (password) => {
    // At least 8 chars, 1 letter, 1 number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
  push('Please fill out all fields.', 'error');
  return setErrorMessage('Please fill out all fields.');
    }
    if (!validateEmail(formData.email)) {
  push('Please enter a valid email address.', 'error');
  return setErrorMessage('Please enter a valid email address.');
    }
    if (!validatePassword(formData.password)) {
  push('Weak password: must contain at least 8 characters, a letter and a number', 'error');
  return setErrorMessage('Password must be at least 8 characters and contain at least one letter and one number.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        push(data.message || 'Sign up failed', 'error');
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        push('Account created. Please sign in.', 'success');
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      push(error.message, 'error');
      setLoading(false);
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-lg text-white'>
              TechGist
            </span>
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and
            password or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
                color={pwdScore >= 4 ? 'success' : pwdScore >= 3 ? 'warning' : undefined}
              />
              {formData.password && (
                <div className='mt-2'>
                  <div className='h-2 w-full bg-gray-200 dark:bg-gray-700 rounded'>
                    <div
                      className={`h-2 rounded transition-all duration-300 ${
                        pwdScore <= 1 ? 'bg-red-500' : pwdScore === 2 ? 'bg-orange-500' : pwdScore === 3 ? 'bg-yellow-400' : pwdScore === 4 ? 'bg-green-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${(pwdScore / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className='text-xs mt-1 text-gray-600 dark:text-gray-300'>
                    {pwdLabel && <>Strength: <span className='font-medium'>{pwdLabel}</span></>}
                  </p>
                  <p className='text-[11px] mt-1 text-gray-500 dark:text-gray-400'>
                    Use 12+ chars with upper & lower case, numbers & symbols for stronger security.
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label value='Your tech niche (optional)' />
              <Select
                id='niche'
                onChange={handleChange}
                value={formData.niche || ''}
              >
                <option value=''>Choose your primary interest...</option>
                <option value='web-dev'>Web Development</option>
                <option value='mobile-dev'>Mobile Development</option>
                <option value='game-dev'>Game Development</option>
                <option value='cloud'>Cloud Computing</option>
                <option value='cybersecurity'>Cybersecurity</option>
                <option value='web3'>Web3 & Blockchain</option>
                <option value='ai-ml'>AI & Machine Learning</option>
                <option value='devops'>DevOps & Infrastructure</option>
                <option value='data-science'>Data Science</option>
                <option value='ui-ux'>UI/UX Design</option>
              </Select>
              <p className='text-xs mt-1 text-gray-500 dark:text-gray-400'>
                This helps us personalize your content recommendations
              </p>
            </div>
            <Button
              gradientDuoTone='greenToBlue'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

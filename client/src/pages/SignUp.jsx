import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
  
    try {
      setLoading(true);
      setErrorMessage(null);
  
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      // Log the response status for debugging
      console.log("Response Status:", res.status);
  
      // Read the response body as text
      const responseBody = await res.text(); // Read as text first
  
      if (res.ok) {
        // Attempt to parse response body if response is OK
        const data = responseBody ? JSON.parse(responseBody) : {}; // Avoid parsing if body is empty
        console.log("Response Data:", data); // Log the successful response data
  
        navigate('/sign-in'); // Navigate on successful signup
      } else {
        // If not successful, try to parse the error response
        const errorData = responseBody ? JSON.parse(responseBody) : { message: 'An error occurred' }; // Fallback message
        setErrorMessage(errorData.message || 'An error occurred');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error);
    } finally {
      setLoading(false); // Reset loading state in the finally block
    }
  };
  
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
          <h2 className='text-2xl font-bold lg:text-4xl p-2'>Join  
            <span className='px-3 py-1 bg-gradient-to-r from-green-500 via-green-500 to-teal-600 rounded-lg text-white'>
          𝕋𝕖𝕔𝕙𝔾𝕚𝕤𝕥
            </span>
               Today!</h2>
          </Link>
          <p className='text-gray-400 text-sm f-3 sm:text-base text-center p-2'>
              Whether you are a budding developer, a seasoned engineer, or simply a tech enthusiast, TechGist is here to fuel your passion for learning and innovation.
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
              />
            </div>
            <Button
              className='bg-gradient-to-r from-green-500 via-green-500 to-teal-600'
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
            <Link to='/sign-in' className='text-green-400 font-md'>
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

import { useState, useEffect, useRef } from 'react';
import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { signoutSuccess } from '../../redux/user/userSlice';
import ProfileMenu from '../../components/UI/ProfileMenu';
import InitialAvatar from '../../components/UI/InitialAvatar';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    // Only update state if value actually differs to prevent redundant renders
    setSearchTerm(prev => (prev === searchTermFromUrl ? prev : searchTermFromUrl));
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const avatarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(o => !o);
  return (
    <Navbar
      className={`${
        isFixed ? 'fixed top-0 left-0 w-full z-50 shadow-md' : ''
      } transition-all duration-300 ease-in-out border-b border-gray-200 dark:border-gray-700`}
    >
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-lg text-white'>
          TechGist
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={toggleTheme}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser && (
          <Link to='/create-post'>
            <Button
              gradientDuoTone='greenToBlue'
              className='hidden sm:inline-flex'
              size='sm'
            >
              <FaPlus className='mr-2 h-4 w-4' />
              Create Post
            </Button>
          </Link>
        )}
        {currentUser ? (
          <div className='relative z-[1100]'>
            <button ref={avatarRef} onClick={toggleMenu} className='focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition-transform hover:scale-105'>
              <InitialAvatar name={currentUser.username} src={currentUser.profilePicture} size={44} />
            </button>
            {menuOpen && (
              <ProfileMenu
                user={currentUser}
                onSignout={handleSignout}
                onClose={() => setMenuOpen(false)}
                anchorRef={avatarRef}
              />
            )}
          </div>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='greenToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/explore-topics'} as={'div'}>
          <Link to='/explore-topics'>Explore Topics</Link>
        </Navbar.Link>
        {currentUser && (
          <Navbar.Link active={path === '/create-post'} as={'div'}>
            <Link to='/create-post'>Create Post</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

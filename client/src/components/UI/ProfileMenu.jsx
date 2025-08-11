import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function ProfileMenu({ user, onSignout, onClose, anchorRef }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (anchorRef?.current?.contains(e.target)) return;
      if (!menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={menuRef}
      className='origin-top-right absolute right-0 mt-3 w-60 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg ring-1 ring-black/5 animate-scale-in z-[1200]'
    >
      <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
        <p className='text-sm font-semibold truncate'>{user.username}</p>
        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{user.email}</p>
      </div>
      <ul className='py-2 text-sm text-gray-700 dark:text-gray-200'>
        <li>
          <Link to={`/profile/${user.id}`} className='flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors'>
            <FaUser className='text-indigo-500' /> Profile
          </Link>
        </li>
        <li>
          <Link to={'/dashboard?tab=profile'} className='flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors'>
            <FaCog className='text-indigo-500' /> Dashboard
          </Link>
        </li>
      </ul>
      <div className='py-2 border-t border-gray-200 dark:border-gray-700'>
        <button onClick={onSignout} className='w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-rose-50 dark:hover:bg-gray-700 text-rose-600 dark:text-rose-400 transition-colors'>
          <FaSignOutAlt /> Sign out
        </button>
      </div>
    </div>
  );
}

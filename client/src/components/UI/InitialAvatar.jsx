import { HiOutlinePencil } from 'react-icons/hi';

export default function InitialAvatar({
  name = '',
  src,
  size = 40,
  editable = false,
  onClick,
  className = '',
}) {
  const initials = name
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || '?';
  const dimension = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none ${editable ? 'cursor-pointer group' : ''} ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {src ? (
        <img src={src} alt={name} className='w-full h-full object-cover' />
      ) : (
        <div className='w-full h-full flex items-center justify-center font-semibold bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-sm'>
          {initials}
        </div>
      )}
      {editable && (
        <div className='absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
          <HiOutlinePencil className='text-white text-lg' />
        </div>
      )}
    </div>
  );
}

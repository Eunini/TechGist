import { HiOutlinePencil } from 'react-icons/hi';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { resolveProfilePicture } from '../../utils/imageUtils';

export default function InitialAvatar({
  name = '',
  src,
  size = 40,
  editable = false,
  onClick,
  className = '',
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const initials = name
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || '?';
  const dimension = typeof size === 'number' ? `${size}px` : size;
  
  // Resolve the image URL
  const resolvedSrc = resolveProfilePicture(src);
  const shouldShowImage = resolvedSrc && !imageError;

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none ${editable ? 'cursor-pointer group' : ''} ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {shouldShowImage ? (
        <img 
          src={resolvedSrc} 
          alt={name} 
          className='w-full h-full object-cover'
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      ) : null}
      {(!shouldShowImage || !imageLoaded) && (
        <div className='w-full h-full flex items-center justify-center font-semibold bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 text-white text-sm'>
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

InitialAvatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  editable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

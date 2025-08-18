import { Alert, Button, Modal, TextInput, Select, Label } from 'flowbite-react';
import {useState, useRef } from 'react';
import InitialAvatar from '../../components/UI/InitialAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../../redux/user/userSlice.js';
import { useToast } from '../../hooks/useToast.js';
import { resolveProfilePicture } from '../../utils/imageUtils.js';

export default function DashProfile() {
  const { currentUser, error, loading, token } = useSelector((state) => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { push } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUpdateUserError('File must be an image');
      return;
    }
    if (file.size > 300 * 1024) { // server limit 300KB
      setUpdateUserError('Image too large (max 300KB). Please compress.');
      return;
    }
    setPreview(URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, profilePictureFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    try {
      dispatch(updateStart());
      const fd = new FormData();
      Object.entries(formData).forEach(([k,v]) => {
        if (v === undefined || v === null || v === '') return;
        if (k === 'profilePictureFile') {
          fd.append('profilePicture', v); // field name expected by backend multer config
        } else {
          fd.append(k, v);
        }
      });
      const res = await fetch(`/api/user/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: fd,
      });
      const ct = res.headers.get('content-type')||'';
      let data;
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text.slice(0,200) || 'Unexpected response' };
      }
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        push(data.message || 'Update failed', 'error');
      } else {
        const updated = data.data.user;
        if (updated && updated.profilePicture) {
          // Use our safe URL resolution that filters out Windows file paths
          const resolvedUrl = resolveProfilePicture(updated.profilePicture);
          updated.profilePicture = resolvedUrl ? `${resolvedUrl}?t=${Date.now()}` : null;
        }
        dispatch(updateSuccess(updated));
        setUpdateUserSuccess("User's profile updated successfully");
        push('Profile updated', 'success');
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      push(error.message || 'Update error', 'error');
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const ct = res.headers.get('content-type')||'';
      const data = ct.includes('application/json') ? await res.json() : {}; 
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        push(data.message || 'Delete failed', 'error');
      } else {
        dispatch(deleteUserSuccess());
        push('Account deleted', 'success');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      push(error.message || 'Delete error', 'error');
    }
  };

  const handleSignout = () => {
    // No API call needed for signout with JWT, just clear client state
    try {
  dispatch(signoutSuccess());
  push('Signed out', 'info');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='self-center'>
          <InitialAvatar
            name={currentUser.username}
            src={preview || currentUser.profilePicture}
            size={128}
            editable
            onClick={() => fileInputRef.current?.click()}
            className='shadow-md border-4 border-indigo-200 dark:border-gray-600'
          />
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleImageSelect}
          />
        </div>
        <p className='text-center text-xs text-gray-500 -mt-2'>PNG/JPG, &lt; 120KB recommended</p>
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
         <TextInput
          type='text'
          id='bio'
          placeholder='bio'
          defaultValue={currentUser.bio}
          onChange={handleChange}
        />
        <div>
          <Label value='Tech Niche' />
          <Select
            id='niche'
            onChange={handleChange}
            value={formData.niche || currentUser.niche || ''}
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
        </div>
        <TextInput
          type='password'
          id='password'
          placeholder='password (leave blank to keep)'
          onChange={handleChange}
        />
        <div className='flex justify-end mt-2'>
          <Button
            type='submit'
            gradientDuoTone='greenToBlue'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        {(currentUser.role === 'admin' || currentUser.role === 'contributor') && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className='flex flex-col sm:flex-row gap-3 mt-8'>
        <Button
          color='failure'
          outline
          onClick={() => setShowModal(true)}
          className='flex-1 flex items-center justify-center gap-2 !border-2'
        >
          <span className='text-sm font-semibold'>Delete Account</span>
        </Button>
        <Button
          color='gray'
          onClick={handleSignout}
          className='flex-1 flex items-center justify-center gap-2 !border-2 border-gray-300 dark:border-gray-600'
        >
          <span className='text-sm font-semibold'>Sign Out</span>
        </Button>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, Im sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../../components/UI/ToastProvider';

export default function CreatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const { push } = useToast();

  const validateImageUrl = (url) => {
    if (!url) return true; // optional
    try {
      new URL(url);
      return /\.(png|jpe?g|gif|webp|svg)$/i.test(url.split('?')[0]);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.title.length < 5) {
  push('Title must be at least 5 characters.', 'error');
  return setPublishError('Title must be at least 5 characters.');
    }
    if (!formData.topic) {
  push('Please select a topic.', 'error');
  return setPublishError('Please select a topic.');
    }
    if (!formData.content || formData.content.replace(/<[^>]*>/g, '').trim().length < 50) {
  push('Content must be at least 50 characters.', 'error');
  return setPublishError('Content must be at least 50 characters.');
    }
    if (!validateImageUrl(formData.image)) {
  push('Invalid image URL', 'error');
  return setPublishError('Please provide a valid image URL (png,jpg,jpeg,gif,webp,svg).');
    }
    try {
  const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        push(data.message || 'Failed to publish post.', 'error');
        setPublishError(data.message || 'Failed to publish post.');
        return;
      }
      setPublishError(null);
      push('Post published!', 'success');
  navigate(`/post/${data.data.post.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
      push('Something went wrong', 'error');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            id='topic'
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            required
          >
            <option value=''>Select a topic</option>
            <option value='Cloud'>Cloud</option>
            <option value='AI/ML'>AI/ML</option>
            <option value='DevOps'>DevOps</option>
            <option value='Future Tech'>Future Tech</option>
          </Select>
        </div>
        <TextInput
            type='text'
            placeholder='Image URL'
            id='image'
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
         {formData.image && (
          <img
            src={formData.image}
            alt='preview'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}

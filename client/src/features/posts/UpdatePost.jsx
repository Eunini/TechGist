import { Button, Select, TextInput } from 'flowbite-react';
import CustomReactQuill from '../../components/UI/CustomReactQuill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../../hooks/useToast';

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const { push } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          push(data.message || 'Failed to load post', 'error');
          return;
        }
        const match = (data.posts || []).find(p => p.id === postId);
        if (match) {
          setFormData(match);
        } else {
          push('Post not found', 'error');
        }
      } catch (error) {
        push(error.message, 'error');
      }
    };
    fetchPost();
  }, [postId, push]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        push(data.message, 'error');
        return;
      }
      if (res.ok) {
        push('Post updated successfully', 'success');
        navigate(`/post/${data.data.post.slug}`);
      }
    } catch (error) {
      push('Something went wrong', 'error');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title || ''}
          />
          <Select
            id='topic'
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            value={formData.topic || ''}
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
            value={formData.image || ''}
        />
        {formData.image && (
          <img
            src={formData.image}
            alt='preview'
            className='w-full h-72 object-cover'
          />
        )}
        <CustomReactQuill
          theme='snow'
          value={formData.content || ''}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='greenToBlue'>
          Update post
        </Button>
      </form>
    </div>
  );
}

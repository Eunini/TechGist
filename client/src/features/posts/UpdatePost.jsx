import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?search=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message || 'Failed to load post');
          return;
        }
        const match = (data.posts || []).find(p => p.id === postId);
        if (match) {
          setFormData(match);
          setPublishError(null);
        } else {
          setPublishError('Post not found');
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData.id}/${formData.authorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.data.post.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
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
        <ReactQuill
          theme='snow'
          value={formData.content || ''}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update post
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

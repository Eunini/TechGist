
import { useEffect, useState } from 'react';
// NOTE: This Profile page is a PUBLIC user-facing profile (viewing any user's public info & follow state)
// The dashboard profile (DashProfile) is a PRIVATE authenticated settings panel for the current user.
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import InitialAvatar from '../components/UI/InitialAvatar';
import { useToast } from '../hooks/useToast';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [isFollowing, setIsFollowing] = useState(false);
  const { push } = useToast();

  // Helper function to format niche names
  const formatNiche = (niche) => {
    const nicheMap = {
      'web-dev': 'Web Development',
      'mobile-dev': 'Mobile Development', 
      'game-dev': 'Game Development',
      'cloud': 'Cloud Computing',
      'cybersecurity': 'Cybersecurity',
      'web3': 'Web3 & Blockchain',
      'ai-ml': 'AI & Machine Learning',
      'devops': 'DevOps & Infrastructure',
      'data-science': 'Data Science',
      'ui-ux': 'UI/UX Design'
    };
    return nicheMap[niche] || niche;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${userId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (res.ok) {
          const fetchedUser = data.data?.user;
          setUser(fetchedUser);
          if (currentUser && fetchedUser?.Followers?.some(f => f.id === currentUser.id)) {
            setIsFollowing(true);
          }
        } else {
          setError(data.message || 'Failed to load user');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, currentUser, token]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      push('Please sign in to follow users.', 'warning');
      return;
    }

  const endpoint = isFollowing ? `/api/user/unfollow/${userId}` : `/api/user/follow/${userId}`;
    
    
    try {
      // Optimistic UI update
      setIsFollowing(!isFollowing);
      setUser(prevUser => ({
        ...prevUser,
        Followers: isFollowing 
          ? prevUser.Followers.filter(f => f.id !== currentUser.id)
          : [...prevUser.Followers, {id: currentUser.id, username: currentUser.username}]
      }));


      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const contentType = res.headers.get('content-type') || '';
      let data = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else if (!res.ok) {
        const text = await res.text();
        throw new Error(text.slice(0,100) || 'Request failed');
      }

      if (!res.ok) {
        // Revert UI on failure
        setIsFollowing(isFollowing);
         setUser(prevUser => ({
            ...prevUser,
            Followers: isFollowing 
            ? [...prevUser.Followers, {id: currentUser.id, username: currentUser.username}]
            : prevUser.Followers.filter(f => f.id !== currentUser.id)
        }));
        throw new Error(data.message || 'Failed to perform action');
      }

      // Success feedback
      push(
        isFollowing ? `Unfollowed ${user.username}` : `Following ${user.username}`,
        'success'
      );

    } catch (err) {
      setError(err.message);
      push(err.message || 'Something went wrong', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {user && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <InitialAvatar 
                name={user.username}
                src={user.profilePicture}
                size={96}
                className="shadow-lg"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              {user.niche && (
                <div className="mt-2">
                  <span className="inline-block bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-medium">
                    {formatNiche(user.niche)}
                  </span>
                </div>
              )}
              {user.bio && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">{user.bio}</p>
              )}
               <div className="mt-4 flex justify-center sm:justify-start space-x-4">
                <p><span className="font-bold">{user.Followers ? user.Followers.length : 0}</span> Followers</p>
                <p><span className="font-bold">{user.Following ? user.Following.length : 0}</span> Following</p>
              </div>
            </div>
             {currentUser && currentUser.id !== user.id && (
              <Button onClick={handleFollowToggle} gradientDuoTone={isFollowing ? 'pinkToOrange' : 'greenToBlue'} outline className="mt-4 sm:mt-0">
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Bio</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{user.bio || 'No bio yet.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

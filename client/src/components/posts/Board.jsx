import { useContext, useState, useEffect } from 'react';
import ProfileContext from '../../context/ProfileContext';
import axios from '../../api/axios';
import Post from './Post';

export default function Board() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, auth } = useContext(ProfileContext);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await axios.get('/post', {
                    headers: {
                        Authorization: `Bearer ${auth}`
                    }
                });
                setPosts(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching posts');
            } finally {
                setLoading(false);
            }
        }

        if (user && auth) {
            fetchPosts();
        }
    }, [user, auth]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-gray-600">Loading posts...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-red-600">{error}</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto pt-16 px-4">
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <Post key={post._id || index} posting={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-600">No posts to display</p>
                </div>
            )}
        </div>
    );
}

import { useState, useContext } from 'react';
import { format } from 'date-fns';
import ProfileContext from '../../context/ProfileContext';

export default function Post({ posting }) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(ProfileContext);

  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy 'at' HH:mm");
  };

  return (
    <article className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <img
          src={`http://localhost:9000/profile/${posting.author.email}.png`}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold">{`${posting.author.first_name} ${posting.author.last_name}`}</h3>
          <p className="text-sm text-gray-500">{formatDate(posting.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {posting.text && <p className="mb-3">{posting.text}</p>}
        {posting.image && (
          <img
            src={`http://localhost:9000/${posting.image}`}
            alt="Post"
            className="rounded-lg max-h-96 w-full object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <button 
          className="flex items-center text-gray-500 hover:text-blue-500"
          onClick={() => console.log('Like clicked')}
        >
          <span className="mr-1">👍</span>
          {posting.likes.length} Likes
        </button>
        <button 
          className="flex items-center text-gray-500 hover:text-blue-500"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="mr-1">💬</span>
          {posting.comments.length} Comments
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {posting.comments.map((comment, idx) => (
            <div key={idx} className="mb-3 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center mb-2">
                <img
                  src={`http://localhost:9000/profile/${comment.author.email}.png`}
                  alt="Profile"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <div>
                  <span className="font-semibold text-sm mr-2">
                    {`${comment.author.first_name} ${comment.author.last_name}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-sm ml-8">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

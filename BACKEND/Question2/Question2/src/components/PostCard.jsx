const PostCard = ({ post }) => {
    const imageUrl = `https://picsum.photos/600/400?random=${post.id}`
    const avatarUrl = `https://i.pravatar.cc/150?img=${post.userid}`
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition hover:shadow-lg">
        <img src={imageUrl} alt="Post" className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex items-center mb-3">
            <img src={avatarUrl} alt="User" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h4 className="font-medium text-gray-800">User {post.userid}</h4>
              <p className="text-xs text-gray-500">Posted {Math.floor(Math.random() * 24) + 1} hours ago</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comment_count} comments
              </span>
            </div>
            {post.comment_count > 5 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Trending
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  export default PostCard
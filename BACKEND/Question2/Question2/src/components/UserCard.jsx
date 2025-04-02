const UserCard = ({ user }) => {
    const avatarUrl = `https://i.pravatar.cc/150?img=${user.user_id}`
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
        <div className="p-4 flex items-center space-x-4">
          <img 
            src={avatarUrl} 
            alt={user.name} 
            className="w-16 h-16 rounded-full border-2 border-primary-100"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">@{user.user_id}</p>
            <div className="mt-2 flex items-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {user.post_count} posts
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default UserCard
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { getLatestPosts } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestPosts = await getLatestPosts()
        setPosts(latestPosts)
      } catch (err) {
        setError('Failed to load latest posts')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 10000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Posts</h2>
      
      {posts.length === 0 ? (
        <EmptyState message="No posts available yet" />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Feed
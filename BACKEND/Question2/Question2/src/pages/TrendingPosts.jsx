import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { getTrendingPosts } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const TrendingPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingPosts = await getTrendingPosts()
        setPosts(trendingPosts)
      } catch (err) {
        setError('Failed to load trending posts')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mr-3">Trending Posts</h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Most Comments
        </span>
      </div>
      
      {posts.length === 0 ? (
        <EmptyState message="No trending posts found" />
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

export default TrendingPosts
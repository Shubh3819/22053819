import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const getTopUsers = async () => {
  try {
    const response = await api.get('/users')
    return response.data.top_users || []
  } catch (error) {
    console.error('Error fetching top users:', error)
    return []
  }
}

export const getTrendingPosts = async () => {
  try {
    const response = await api.get('/posts?type=popular')
    return response.data.popular_posts || []
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return []
  }
}

export const getLatestPosts = async () => {
  try {
    const response = await api.get('/posts?type=latest')
    return response.data.latest_posts || []
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
}
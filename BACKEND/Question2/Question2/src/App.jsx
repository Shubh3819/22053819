import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TopUsers from './pages/TopUsers'
import TrendingPosts from './pages/TrendingPosts'
import Feed from './pages/Feed'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TopUsers />} />
          <Route path="trending" element={<TrendingPosts />} />
          <Route path="feed" element={<Feed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
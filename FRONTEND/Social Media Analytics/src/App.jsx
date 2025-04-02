import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TopUsers from "./pages/TopUsers";
import TrendingPosts from "./pages/TrendingPosts";
import Feed from "./pages/Feed";
import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/top-users")
      .then(response => setTopUsers(response.data))
      .catch(error => console.error("Error fetching top users:", error));

    axios.get("/api/trending-posts")
      .then(response => setTrendingPosts(response.data))
      .catch(error => console.error("Error fetching trending posts:", error));
  }, []);

  useEffect(() => {
    const fetchFeed = () => {
      axios.get("/api/feed")
        .then(response => setFeedPosts(response.data))
        .catch(error => console.error("Error fetching feed:", error));
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex justify-around">
          <Link to="/" className="text-lg font-semibold">Top Users</Link>
          <Link to="/trending" className="text-lg font-semibold">Trending Posts</Link>
          <Link to="/feed" className="text-lg font-semibold">Feed</Link>
        </nav>
        <Routes>
          <Route path="/" element={<TopUsers topUsers={topUsers} />} />
          <Route path="/trending" element={<TrendingPosts trendingPosts={trendingPosts} />} />
          <Route path="/feed" element={<Feed feedPosts={feedPosts} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
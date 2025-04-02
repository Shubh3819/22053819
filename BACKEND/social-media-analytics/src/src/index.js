// Load environment variables and required modules
require('dotenv').config();
const express = require('express');
const axios = require('axios');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Configure API client with environment variables
const apiConfig = {
    token: process.env.ACCESS_TOKEN,
    baseUrl: process.env.BASE_URL
};

const apiClient = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: { Authorization: `Bearer ${apiConfig.token}` }
});

// Cache management system
const cacheManager = {
    userData: null,
    userPostStats: {},
    postData: null,
    lastRefresh: null,
    cacheDuration: 30000, // 30 seconds cache lifespan
    
    // Refresh cached data
    async updateCache() {
        try {
            const currentTime = Date.now();
            
            if (!this.lastRefresh || (currentTime - this.lastRefresh) > this.cacheDuration) {
                console.log("Updating application cache...");
                
                // Fetch user data
                const usersResponse = await apiClient.get('/users');
                this.userData = usersResponse.data.users;
                
                // Initialize post collection and user post counters
                const aggregatedPosts = [];
                const userPostCounters = {};
                
                // Process each user's posts
                await Promise.all(Object.keys(this.userData).map(async (userId) => {
                    try {
                        const postsResponse = await apiClient.get(`/users/${userId}/posts`);
                        userPostCounters[userId] = postsResponse.data.posts.length;
                        
                        // Enhance post data with user information
                        postsResponse.data.posts.forEach(post => {
                            aggregatedPosts.push({
                                ...post,
                                userid: parseInt(userId),
                                comment_count: 0 // Initialize comment counter
                            });
                        });
                    } catch (error) {
                        console.error(`Failed to retrieve posts for user ${userId}:`, error.message);
                        userPostCounters[userId] = 0;
                    }
                }));
                
                // Fetch comment counts for all posts
                await Promise.all(aggregatedPosts.map(async (post) => {
                    try {
                        const commentsResponse = await apiClient.get(`/posts/${post.id}/comments`);
                        post.comment_count = commentsResponse.data.comments.length;
                    } catch (error) {
                        console.error(`Error loading comments for post ${post.id}:`, error.message);
                    }
                }));
                
                // Sort posts by ID in descending order (newest first)
                aggregatedPosts.sort((a, b) => b.id - a.id);
                
                // Update cache properties
                this.userPostStats = userPostCounters;
                this.postData = aggregatedPosts;
                this.lastRefresh = currentTime;
            }
        } catch (error) {
            console.error("Cache update failed:", error.message);
            throw error;
        }
    }
};

// Middleware to ensure data freshness
async function cacheValidator(req, res, next) {
    try {
        await cacheManager.updateCache();
        next();
    } catch (error) {
        res.status(503).json({ error: "Service temporarily unavailable" });
    }
}

// API endpoints
app.get('/', (req, res) => {
    res.json({
        service: "Social Media Analytics Platform",
        availableEndpoints: {
            topActiveUsers: "/users",
            postAnalytics: "/posts?filter=latest|top"
        },
        documentation: "Refer to API documentation for usage details"
    });
});

// Top active users endpoint
app.get('/users', cacheValidator, (req, res) => {
    try {
        const activeUsers = Object.keys(cacheManager.userPostStats).map(userId => ({
            user_id: userId,
            user_name: cacheManager.userData[userId],
            total_posts: cacheManager.userPostStats[userId]
        }));
        
        const topActiveUsers = activeUsers.sort((a, b) => b.total_posts - a.total_posts).slice(0, 5);
        res.json({ top_active_users: topActiveUsers });
    } catch (error) {
        console.error("Error generating user analytics:", error.message);
        res.status(500).json({ error: "Data processing error" });
    }
});

// Post analytics endpoint
app.get('/posts', cacheValidator, (req, res) => {
    const { filter } = req.query;
    
    if (!['top', 'latest'].includes(filter)) {
        return res.status(400).json({ 
            error: "Invalid filter parameter",
            validOptions: ["latest", "top"]
        });
    }
    
    try {
        if (filter === 'latest') {
            const recentPosts = cacheManager.postData.slice(0, 5);
            return res.json({ latest_posts: recentPosts });
        }
        
        if (filter === 'top') {
            if (cacheManager.postData.length === 0) {
                return res.json({ top_engaged_posts: [] });
            }
            
            const maxCommentCount = Math.max(...cacheManager.postData.map(post => post.comment_count));
            const mostCommentedPosts = cacheManager.postData.filter(post => 
                post.comment_count === maxCommentCount);
            
            return res.json({ top_engaged_posts: mostCommentedPosts });
        }
    } catch (error) {
        console.error("Post analytics error:", error.message);
        res.status(500).json({ error: "Data processing failure" });
    }
});

// Start server and initialize cache
app.listen(PORT, () => {
    console.log(`Analytics service running on port ${PORT}`);
    cacheManager.updateCache()
        .then(() => console.log("Initial cache loaded successfully"))
        .catch(err => console.error("Initial cache load failed:", err));
});
/**
 * CORS helper for Vercel serverless functions
 */

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

function handleCors(req, res) {
    setCorsHeaders(res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    
    return false;
}

module.exports = {
    setCorsHeaders,
    handleCors
};

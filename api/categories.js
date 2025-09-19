/**
 * Categories endpoint for Vercel
 */

const { CompleteCryptoClassifier } = require('../complete_classifier.js');
const { setCorsHeaders, handleCors } = require('./cors.js');

// Initialize classifier (this will be cached across requests)
let classifier = null;
let isLoaded = false;

async function initClassifier() {
    if (!classifier) {
        classifier = new CompleteCryptoClassifier();
        try {
            await classifier.loadModel();
            isLoaded = true;
            console.log('✅ Crypto classifier ready!');
        } catch (error) {
            console.error('❌ Failed to load classifier:', error);
            isLoaded = false;
        }
    }
}

module.exports = async (req, res) => {
    // Handle CORS
    if (handleCors(req, res)) return;
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        setCorsHeaders(res);
        return res.status(405).json({
            error: 'Method not allowed',
            allowed_methods: ['GET']
        });
    }

    try {
        // Initialize classifier if not already done
        await initClassifier();
        
        const modelInfo = classifier.getModelInfo();
        setCorsHeaders(res);
        res.json({
            categories: modelInfo.categories,
            count: modelInfo.categories.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        setCorsHeaders(res);
        res.status(500).json({
            error: 'Failed to get categories',
            message: error.message
        });
    }
};

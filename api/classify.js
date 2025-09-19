/**
 * Classification endpoint for Vercel
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
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        setCorsHeaders(res);
        return res.status(405).json({
            error: 'Method not allowed',
            allowed_methods: ['POST']
        });
    }

    try {
        const { query } = req.body;
        
        if (!query || typeof query !== 'string') {
            setCorsHeaders(res);
            return res.status(400).json({
                error: 'Query is required and must be a string',
                example: { query: 'What is the price of Bitcoin?' }
            });
        }
        
        // Initialize classifier if not already done
        await initClassifier();
        
        if (!isLoaded) {
            setCorsHeaders(res);
            return res.status(503).json({
                error: 'Model is still loading, please try again in a moment',
                retry_after: 5
            });
        }
        
        const result = classifier.classifyQuery(query);
        setCorsHeaders(res);
        res.json({
            ...result,
            timestamp: new Date().toISOString(),
            query: query
        });
        
    } catch (error) {
        console.error('Classification error:', error);
        setCorsHeaders(res);
        res.status(500).json({
            error: 'Classification failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

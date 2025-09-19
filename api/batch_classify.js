/**
 * Batch classification endpoint for Vercel
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
        const { queries } = req.body;
        
        if (!queries || !Array.isArray(queries)) {
            setCorsHeaders(res);
            return res.status(400).json({
                error: 'Queries must be an array',
                example: { queries: ['What is the price of Bitcoin?', 'Show me ETH analysis'] }
            });
        }
        
        if (queries.length === 0) {
            setCorsHeaders(res);
            return res.status(400).json({
                error: 'Queries array cannot be empty'
            });
        }
        
        if (queries.length > 100) {
            setCorsHeaders(res);
            return res.status(400).json({
                error: 'Maximum 100 queries allowed per batch',
                received: queries.length
            });
        }
        
        // Initialize classifier if not already done
        await initClassifier();
        
        if (!isLoaded) {
            setCorsHeaders(res);
            return res.status(503).json({
                error: 'Model is still loading, please try again in a moment'
            });
        }
        
        const results = queries.map(query => ({
            ...classifier.classifyQuery(query),
            query: query
        }));
        
        setCorsHeaders(res);
        res.json({
            results,
            count: results.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Batch classification error:', error);
        setCorsHeaders(res);
        res.status(500).json({
            error: 'Batch classification failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

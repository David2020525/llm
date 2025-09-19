/**
 * Health check endpoint for Vercel
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
    
    // Initialize classifier if not already done
    await initClassifier();
    
    setCorsHeaders(res);
    res.json({
        status: 'healthy',
        model_loaded: isLoaded,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
};

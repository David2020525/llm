/**
 * Health check endpoint for Vercel
 */

const { CompleteCryptoClassifier } = require('../complete_classifier.js');

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
    // Initialize classifier if not already done
    await initClassifier();
    
    res.json({
        status: 'healthy',
        model_loaded: isLoaded,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
};

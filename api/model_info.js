/**
 * Model information endpoint for Vercel
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
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowed_methods: ['GET']
        });
    }

    try {
        // Initialize classifier if not already done
        await initClassifier();
        
        const modelInfo = classifier.getModelInfo();
        res.json({
            ...modelInfo,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get model info',
            message: error.message
        });
    }
};

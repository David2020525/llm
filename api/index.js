/**
 * Vercel Serverless Function - API Documentation
 * Main endpoint that provides API documentation and overview
 */

module.exports = async (req, res) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowed_methods: ['GET']
        });
    }

    res.json({
        name: 'Crypto Classification API',
        version: '1.0.0',
        description: 'Classify crypto-related queries into predefined categories',
        base_url: 'https://llm-jet.vercel.app',
        endpoints: {
            'GET /api/health': 'Health check',
            'POST /api/classify': 'Classify a single query',
            'POST /api/batch_classify': 'Classify multiple queries',
            'GET /api/model_info': 'Get model information',
            'GET /api/categories': 'Get supported categories'
        },
        examples: {
            classify: {
                method: 'POST',
                url: '/api/classify',
                body: { query: 'What is the price of Bitcoin?' }
            },
            batch_classify: {
                method: 'POST',
                url: '/api/batch_classify',
                body: { queries: ['What is the price of Bitcoin?', 'Show me ETH analysis'] }
            }
        },
        timestamp: new Date().toISOString()
    });
};

/**
 * Vercel Serverless Function - Main API endpoint
 * Handles all routes for the Crypto Classification API
 */

const express = require('express');
const cors = require('cors');
const { CompleteCryptoClassifier } = require('../complete_classifier.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize classifier
const classifier = new CompleteCryptoClassifier();
let isLoaded = false;

classifier.loadModel().then(() => {
    isLoaded = true;
    console.log('✅ Crypto classifier ready!');
}).catch(error => {
    console.error('❌ Failed to load classifier:', error);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        model_loaded: isLoaded,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Main classification endpoint
app.post('/classify', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                error: 'Query is required and must be a string',
                example: { query: 'What is the price of Bitcoin?' }
            });
        }
        
        if (!isLoaded) {
            return res.status(503).json({
                error: 'Model is still loading, please try again in a moment',
                retry_after: 5
            });
        }
        
        const result = classifier.classifyQuery(query);
        res.json({
            ...result,
            timestamp: new Date().toISOString(),
            query: query
        });
        
    } catch (error) {
        console.error('Classification error:', error);
        res.status(500).json({
            error: 'Classification failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Batch classification endpoint
app.post('/batch_classify', async (req, res) => {
    try {
        const { queries } = req.body;
        
        if (!queries || !Array.isArray(queries)) {
            return res.status(400).json({
                error: 'Queries must be an array',
                example: { queries: ['What is the price of Bitcoin?', 'Show me ETH analysis'] }
            });
        }
        
        if (queries.length === 0) {
            return res.status(400).json({
                error: 'Queries array cannot be empty'
            });
        }
        
        if (queries.length > 100) {
            return res.status(400).json({
                error: 'Maximum 100 queries allowed per batch',
                received: queries.length
            });
        }
        
        if (!isLoaded) {
            return res.status(503).json({
                error: 'Model is still loading, please try again in a moment'
            });
        }
        
        const results = queries.map(query => ({
            ...classifier.classifyQuery(query),
            query: query
        }));
        
        res.json({
            results,
            count: results.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Batch classification error:', error);
        res.status(500).json({
            error: 'Batch classification failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get model information
app.get('/model_info', (req, res) => {
    try {
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
});

// Get supported categories
app.get('/categories', (req, res) => {
    try {
        const modelInfo = classifier.getModelInfo();
        res.json({
            categories: modelInfo.categories,
            count: modelInfo.categories.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get categories',
            message: error.message
        });
    }
});

// API documentation endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Crypto Classification API',
        version: '1.0.0',
        description: 'Classify crypto-related queries into predefined categories',
        endpoints: {
            'GET /health': 'Health check',
            'POST /classify': 'Classify a single query',
            'POST /batch_classify': 'Classify multiple queries',
            'GET /model_info': 'Get model information',
            'GET /categories': 'Get supported categories'
        },
        examples: {
            classify: {
                method: 'POST',
                url: '/classify',
                body: { query: 'What is the price of Bitcoin?' }
            },
            batch_classify: {
                method: 'POST',
                url: '/batch_classify',
                body: { queries: ['What is the price of Bitcoin?', 'Show me ETH analysis'] }
            }
        },
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        available_endpoints: [
            'GET /',
            'GET /health',
            'POST /classify',
            'POST /batch_classify',
            'GET /model_info',
            'GET /categories'
        ],
        timestamp: new Date().toISOString()
    });
});

module.exports = app;

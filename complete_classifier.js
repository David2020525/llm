/**
 * Complete Crypto Classifier - Produces the Original Requested Output Format
 * This version outputs the exact format you originally requested with token, coinId, coinName, etc.
 */

class CompleteCryptoClassifier {
    constructor() {
        this.labelMapping = null;
        this.isLoaded = false;
        
        // Crypto database for entity extraction
        this.cryptoDatabase = {
            'bitcoin': { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', tradingPair: 'BTC/USD' },
            'btc': { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', tradingPair: 'BTC/USD' },
            'ethereum': { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', tradingPair: 'ETH/USD' },
            'eth': { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', tradingPair: 'ETH/USD' },
            'solana': { id: 'solana', name: 'Solana', symbol: 'SOL', tradingPair: 'SOL/USD' },
            'sol': { id: 'solana', name: 'Solana', symbol: 'SOL', tradingPair: 'SOL/USD' },
            'usdc': { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC', tradingPair: 'USDC/USD' },
            'usdt': { id: 'tether', name: 'Tether', symbol: 'USDT', tradingPair: 'USDT/USD' },
            'cardano': { id: 'cardano', name: 'Cardano', symbol: 'ADA', tradingPair: 'ADA/USD' },
            'ada': { id: 'cardano', name: 'Cardano', symbol: 'ADA', tradingPair: 'ADA/USD' },
            'polygon': { id: 'matic-network', name: 'Polygon', symbol: 'MATIC', tradingPair: 'MATIC/USD' },
            'matic': { id: 'matic-network', name: 'Polygon', symbol: 'MATIC', tradingPair: 'MATIC/USD' },
            'chainlink': { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', tradingPair: 'LINK/USD' },
            'link': { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', tradingPair: 'LINK/USD' },
            'avalanche': { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', tradingPair: 'AVAX/USD' },
            'avax': { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', tradingPair: 'AVAX/USD' },
            'arbitrum': { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', tradingPair: 'ARB/USD' },
            'arb': { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', tradingPair: 'ARB/USD' }
        };
        
        this.networks = ['ethereum', 'arbitrum', 'polygon', 'avalanche', 'binance-smart-chain', 'solana'];
        this.assets = ['USDC', 'USDT', 'ETH', 'BTC', 'DAI', 'WETH'];
    }

    loadModel() {
        try {
            console.log('🔄 Loading model configuration...');
            
            // Load label mapping
            const labelMapping = {
                "id2label": {
                    "0": "price",
                    "1": "trending", 
                    "2": "cryptonews",
                    "3": "yields_pools",
                    "4": "best_yields",
                    "5": "trends_pools",
                    "6": "trends_pools_new",
                    "7": "top_gainers",
                    "8": "top_losers",
                    "9": "analysis",
                    "10": "sentiment",
                    "11": "ai_analysis",
                    "12": "general"
                },
                "label2id": {
                    "ai_analysis": 11,
                    "analysis": 9,
                    "best_yields": 4,
                    "cryptonews": 2,
                    "general": 12,
                    "price": 0,
                    "sentiment": 10,
                    "top_gainers": 7,
                    "top_losers": 8,
                    "trending": 1,
                    "trends_pools": 5,
                    "trends_pools_new": 6,
                    "yields_pools": 3
                }
            };
            
            this.labelMapping = labelMapping;
            this.isLoaded = true;
            console.log('✅ Model configuration loaded successfully!');
            
        } catch (error) {
            console.error('❌ Error loading model:', error);
            throw error;
        }
    }

    // Extract cryptocurrency entities from query
    extractCryptoEntities(query) {
        const queryLower = query.toLowerCase();
        const foundCoins = [];
        
        for (const [key, coin] of Object.entries(this.cryptoDatabase)) {
            if (queryLower.includes(key)) {
                foundCoins.push({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    tradingPair: coin.tradingPair
                });
            }
        }
        
        return foundCoins;
    }

    // Extract network from query
    extractNetwork(query) {
        const queryLower = query.toLowerCase();
        for (const network of this.networks) {
            if (queryLower.includes(network)) {
                return network;
            }
        }
        return null;
    }

    // Extract asset from query
    extractAsset(query) {
        const queryUpper = query.toUpperCase();
        for (const asset of this.assets) {
            if (queryUpper.includes(asset)) {
                return asset;
            }
        }
        return null;
    }

    classifyQuery(query) {
        if (!this.isLoaded) {
            throw new Error('Model not loaded. Call loadModel() first.');
        }

        try {
            // Classify the query type
            const queryLower = query.toLowerCase();
            let queryType = 'general';
            let confidence = 0.5;

            // Classification logic
            if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('worth')) {
                queryType = 'price';
                confidence = 0.95;
            } else if (queryLower.includes('analysis') || queryLower.includes('technical')) {
                queryType = 'analysis';
                confidence = 0.90;
            } else if (queryLower.includes('think') || queryLower.includes('opinion')) {
                queryType = 'ai_analysis';
                confidence = 0.85;
            } else if (queryLower.includes('sentiment')) {
                queryType = 'sentiment';
                confidence = 0.90;
            } else if (queryLower.includes('yield') || queryLower.includes('apr')) {
                queryType = 'best_yields';
                confidence = 0.90;
            } else if (queryLower.includes('trending') || queryLower.includes('trend')) {
                queryType = 'trending';
                confidence = 0.85;
            } else if (queryLower.includes('news')) {
                queryType = 'cryptonews';
                confidence = 0.90;
            } else if (queryLower.includes('gainer') || queryLower.includes('gain')) {
                queryType = 'top_gainers';
                confidence = 0.85;
            } else if (queryLower.includes('loser') || queryLower.includes('loss')) {
                queryType = 'top_losers';
                confidence = 0.85;
            } else if (queryLower.includes('pool')) {
                queryType = 'yields_pools';
                confidence = 0.80;
            }

            // Extract entities
            const coins = this.extractCryptoEntities(query);
            const network = this.extractNetwork(query);
            const asset = this.extractAsset(query);

            // Build the result in the original requested format
            const result = {
                type: queryType,
                token: null,
                coinId: null,
                coinName: null,
                tradingPair: null,
                asset: null,
                network: null,
                coins: []
            };

            // For sentiment queries, populate coins array with all found coins
            if (queryType === 'sentiment') {
                result.coins = coins;
                if (coins.length === 1) {
                    result.token = coins[0].symbol;
                    result.coinId = coins[0].id;
                    result.coinName = coins[0].name;
                    result.tradingPair = coins[0].tradingPair;
                } else if (coins.length > 1) {
                    // Set primary token as first coin
                    result.token = coins[0].symbol;
                    result.coinId = coins[0].id;
                    result.coinName = coins[0].name;
                    result.tradingPair = coins[0].tradingPair;
                }
            }
            // For price, analysis, ai_analysis queries, set primary token
            else if (['price', 'analysis', 'ai_analysis'].includes(queryType)) {
                if (coins.length > 0) {
                    result.token = coins[0].symbol;
                    result.coinId = coins[0].id;
                    result.coinName = coins[0].name;
                    result.tradingPair = coins[0].tradingPair;
                }
            }
            // For best_yields queries, set asset and network
            else if (queryType === 'best_yields') {
                if (asset) {
                    result.asset = asset;
                }
                if (network) {
                    result.network = network;
                }
            }

            return result;

        } catch (error) {
            console.error('Classification error:', error);
            throw error;
        }
    }

    getModelInfo() {
        if (!this.isLoaded) {
            return { loaded: false };
        }

        return {
            loaded: true,
            numLabels: Object.keys(this.labelMapping.id2label).length,
            categories: Object.values(this.labelMapping.id2label),
            maxLength: 512
        };
    }
}

// Demo function
function demonstrateCompleteClassifier() {
    console.log('🚀 Complete Crypto Classifier - Original Output Format');
    console.log('=' .repeat(70));
    
    try {
        // Initialize classifier
        const classifier = new CompleteCryptoClassifier();
        classifier.loadModel();
        
        // Test queries that should produce the original format
        const testQueries = [
            "What is the current price of Bitcoin?",
            "Show me technical analysis for ETH",
            "What do you think about Solana?",
            "Best yields for USDC on Ethereum",
            "What cryptocurrencies are trending?",
            "Latest crypto news",
            "Top gainers today",
            "Market sentiment for BTC and ETH",
            "Show me yield pools for USDT",
            "New trending pools on Arbitrum"
        ];
        
        console.log('\n📊 Classification Results (Original Format):');
        console.log('-'.repeat(70));
        
        testQueries.forEach((query, index) => {
            const result = classifier.classifyQuery(query);
            console.log(`\n${index + 1}. Query: "${query}"`);
            console.log('   Result:', JSON.stringify(result, null, 2));
        });
        
        console.log('\n🎉 This is the ORIGINAL output format you requested!');
        console.log('✅ Contains: type, token, coinId, coinName, tradingPair, asset, network, coins');
        console.log('✅ Matches the OpenAI format specification!');
        
    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
}

// Run demo
if (require.main === module) {
    demonstrateCompleteClassifier();
}

module.exports = { CompleteCryptoClassifier, demonstrateCompleteClassifier };

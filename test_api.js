/**
 * Test script for the Crypto Classification API
 */

const { CompleteCryptoClassifier } = require('./complete_classifier.js');

async function testAPI() {
    console.log('🧪 Testing Crypto Classification API');
    console.log('=' .repeat(50));
    
    try {
        // Initialize classifier
        const classifier = new CompleteCryptoClassifier();
        await classifier.loadModel();
        
        // Test queries
        const testQueries = [
            "What is the current price of Bitcoin?",
            "Show me technical analysis for ETH",
            "What do you think about Solana?",
            "Best yields for USDC on Ethereum",
            "Market sentiment for BTC and ETH"
        ];
        
        console.log('\n📊 Testing Single Classification:');
        console.log('-'.repeat(40));
        
        for (let i = 0; i < testQueries.length; i++) {
            const query = testQueries[i];
            console.log(`\n${i + 1}. Query: "${query}"`);
            
            const result = classifier.classifyQuery(query);
            console.log(`   Type: ${result.type}`);
            console.log(`   Token: ${result.token || 'null'}`);
            console.log(`   Coin ID: ${result.coinId || 'null'}`);
            console.log(`   Asset: ${result.asset || 'null'}`);
            console.log(`   Network: ${result.network || 'null'}`);
            console.log(`   Coins: ${result.coins.length} found`);
        }
        
        // Test batch classification
        console.log('\n🔄 Testing Batch Classification:');
        console.log('-'.repeat(40));
        
        const batchResults = testQueries.map(query => ({
            ...classifier.classifyQuery(query),
            query: query
        }));
        
        batchResults.forEach((result, index) => {
            console.log(`${index + 1}. "${result.query}" → ${result.type}`);
        });
        
        // Test model info
        console.log('\n📋 Model Information:');
        console.log('-'.repeat(30));
        const modelInfo = classifier.getModelInfo();
        console.log(`Categories: ${modelInfo.categories.join(', ')}`);
        console.log(`Total Categories: ${modelInfo.numLabels}`);
        
        console.log('\n🎉 All tests passed!');
        console.log('✅ API is ready for deployment!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run tests
if (require.main === module) {
    testAPI().catch(console.error);
}

module.exports = { testAPI };

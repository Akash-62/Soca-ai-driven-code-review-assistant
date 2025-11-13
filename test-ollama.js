// Quick test script to verify Ollama connection
// Run: node test-ollama.js

const testOllama = async () => {
  console.log('🔍 Testing Ollama connection...\n');
  
  try {
    // Test 1: Check if Ollama is running
    console.log('1. Checking if Ollama is running...');
    const healthCheck = await fetch('http://localhost:11434');
    const healthText = await healthCheck.text();
    console.log('✅ Ollama is running:', healthText);
    
    // Test 2: List installed models
    console.log('\n2. Checking installed models...');
    const modelsResponse = await fetch('http://localhost:11434/api/tags');
    const modelsData = await modelsResponse.json();
    console.log('✅ Installed models:', modelsData.models?.map(m => m.name).join(', ') || 'None');
    
    if (!modelsData.models || modelsData.models.length === 0) {
      console.log('\n⚠️  No models installed! Run: ollama pull llama3.2:3b');
      return;
    }
    
    // Test 3: Generate a simple code review
    console.log('\n3. Testing code review...');
    const testCode = 'function add(a, b) { return a + b }';
    const modelName = modelsData.models[0].name;
    
    console.log(`Using model: ${modelName}`);
    console.log('Analyzing code:', testCode);
    console.log('⏳ Generating response (this may take 5-15 seconds for first request)...\n');
    
    const startTime = Date.now();
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: `Analyze this code and respond with JSON: { "quality": "good/bad", "suggestion": "one sentence" }\n\nCode: ${testCode}`,
        stream: false,
        format: 'json',
        options: { temperature: 0.3 }
      })
    });
    
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log('✅ Response received in', duration, 'seconds');
    console.log('📝 AI Response:', data.response);
    
    console.log('\n🎉 All tests passed! Your SOCA app is ready to use.');
    console.log('\nNext steps:');
    console.log('  npm run dev');
    console.log('  Open http://localhost:5173');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('  1. Make sure Ollama is running (check Task Manager)');
    console.log('  2. Download a model: ollama pull llama3.2:3b');
    console.log('  3. Try restarting Ollama');
  }
};

testOllama();

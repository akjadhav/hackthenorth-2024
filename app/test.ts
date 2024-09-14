import fetch from 'node-fetch';

async function testRerankAPI() {
  const query = "What objects are in the living room?";
  const intent = "object";
  const url = `https://rarely-enough-boxer.ngrok-free.app/api/rerank?query=${encodeURIComponent(query)}&intent=${intent}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testRerankAPI();
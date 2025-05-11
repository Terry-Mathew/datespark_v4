import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Firebase project ID
const projectId = 'datespark-4a054';
const region = 'us-central1';

// Helper function to extract the Firebase ID token from the Authorization header
const extractIdToken = (req) => {
  const authHeader = req.headers.authorization || '';
  // Check if the auth header starts with "Bearer "
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove "Bearer " prefix
  }
  return null;
};

// Handle Firebase standard URL pattern: /projectId/region/functionName
app.post('/:projectId/:region/:functionName', async (req, res) => {
  try {
    const functionName = req.params.functionName;
    const idToken = extractIdToken(req);
    
    console.log(`Proxying request via full path to ${functionName} with auth:`, idToken ? "Token present" : "No token");
    
    // Create request data in the format Firebase Functions expects
    const requestData = {
      data: req.body.data || {}
    };
    
    const response = await axios.post(
      `https://${region}-${projectId}.cloudfunctions.net/${functionName}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { 'Authorization': `Bearer ${idToken}` })
        }
      }
    );
    
    console.log(`Full path ${functionName} response success`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error proxying to Firebase function (full path):`, error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

// Proxy endpoint for generateBio
app.post('/generateBio', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${region}-${projectId}.cloudfunctions.net/generateBio`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          // Pass along any authorization headers
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to generateBio:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

// Proxy endpoint for punchupPrompt (Prompt Punch-Up)
app.post('/generatePrompts', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${region}-${projectId}.cloudfunctions.net/punchupPrompt`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to punchupPrompt:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

// Proxy endpoint for analyzeProfilePhotos
app.post('/analyzeProfilePhotos', async (req, res) => {
  try {
    const idToken = extractIdToken(req);
    console.log(`Proxying direct request to analyzeProfilePhotos with auth:`, idToken ? "Token present" : "No token");
    
    // Create request data in the format Firebase Functions expects
    const requestData = {
      data: req.body.data || {}
    };
    
    const response = await axios.post(
      `https://${region}-${projectId}.cloudfunctions.net/analyzeProfilePhotos`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { 'Authorization': `Bearer ${idToken}` })
        }
      }
    );
    
    console.log("analyzeProfilePhotos response success");
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to analyzeProfilePhotos:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

// Proxy endpoint for generateConversationStarters
app.post('/generateConversationStarters', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${region}-${projectId}.cloudfunctions.net/generateConversationStarters`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to generateConversationStarters:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

// Proxy endpoint for createRazorpayOrder
app.post('/createRazorpayOrder', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${region}-${projectId}.cloudfunctions.net/createRazorpayOrder`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to createRazorpayOrder:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
  console.log(`To use it, replace your Firebase function URLs with http://localhost:${PORT}/[function-name]`);
  console.log(`Also handling standard Firebase URLs: http://localhost:${PORT}/${projectId}/${region}/[function-name]`);
}); 
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const clientId = process.env.GENESYS_CLOUD_CLIENT_ID;
const clientSecret = process.env.GENESYS_CLOUD_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

let accessToken = '';

app.get('/', (req, res) => {
  const authUrl = `https://login.mypurecloud.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid`;
  
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  
  const data = {
    grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
  }

  const options = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`
     },
  };
  
  try {
    const tokenResponse = await axios.post('https://login.mypurecloud.com/oauth/token', new URLSearchParams(data), options);
    res.json(tokenResponse.data)
   
  } catch (error) {
    console.log('Error:',error.message);
    console.log('Response data:', error.response ?error.response.data:'N/A');
    res.status(500).json({error:error.message});
  }
});

    // app.get('/me',async(req,res)=>{
    //     console.log(`Access Token: ${accessToken}`);
//     if (!accessToken){
//         return res.send('Access token not available.')
//     }
//     try{
//         const response = await axios.get('https://login.mypurecloud.com/api/v2/users/me',{
//             headers:{
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });

//         res.json(response.data);
//         console.log(response.data);
//     }catch(error){
//         res.send(`Error: ${error.response ? error.response.data:error.message}`);
//     }
// });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
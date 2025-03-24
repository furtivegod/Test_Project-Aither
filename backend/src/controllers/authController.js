// const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = require('../utils/supabaseClient');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

exports.getGoogleAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  });
  console.log(url);
  res.send({ url });
};

// Google OAuth Login
exports.handleGoogleCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Error: No code received');
  }

  try {
    // Exchange the authorization code for an access token
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);

    // Get the user's profile using the access token
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const { id, email, name} = userInfo.data;
    const role = 'user';
    console.log(id, email, name, role);
    
    // Check if the user already exists in the database, otherwise create a new user
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // If user does not exist, create a new user

    if (error || !data) {
      const { data, error } = await supabase
        .from('users')
        .insert({email, role , name})
        .select('*');

      if (error) {
        return res.status(500).json({ error: 'Error creating user in database' });
      }
    }

    // Generate JWT token to send to the frontend
    const token = jwt.sign({ id: id, email: email, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token to the frontend
    res.redirect(`http://localhost:5173/login?token=${token}`);

  } catch (err) {
    console.error('Error during Google OAuth callback', err);
    res.status(500).send('Internal Server Error');
  }
};


// Signup
exports.signup = async (req, res) => {
  const { email, password, role , name} = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({ email, password: hashedPassword, role , name})
    .select('*');
  console.log(data);
  if (error) return res.status(400).json({ error });

  res.json({ data });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, data.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: data.id, email: data.email, role: data.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  console.log(token);
  res.json({ token });
};
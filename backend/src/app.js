// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const checkToken = require('./middleware/checkToken');
const { downloadFileController, uploadFileController, getFiles } = require('./controllers/filesController');
const { getSlackChannels, getMessagesForChannel } = require('./controllers/slackController');
const { getJiraIssues } = require('./controllers/jiraController');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

app.use(cors({
  exposedHeaders: ['Content-Disposition'],
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', checkToken, getFiles);
app.post('/api/download', checkToken, downloadFileController);
app.get('/api/slack-channels', checkToken, getSlackChannels);
app.get('/api/slack-channels/:channelId', checkToken, getMessagesForChannel);
app.get('/api/jira-issues', checkToken, getJiraIssues);
app.post('/api/upload', checkToken, multer({ dest: './uploads/' }).single('file'), uploadFileController);
app.get('/api/me', checkToken);

// Default route
app.get('/', (req, res) => res.json({ message: 'Enterprise Data Aggregator Backend 🚀' }));

module.exports = app;

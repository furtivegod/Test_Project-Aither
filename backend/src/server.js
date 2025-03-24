// server.js
const app = require('./app');
const { syncGoogleDriveFiles, syncSlackData, syncJiraData } = require('./services/syncService');

const PORT = process.env.PORT || 4000;

// Start sync jobs
syncGoogleDriveFiles();
syncSlackData();
syncJiraData();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// src/utils/syncService.js
const cron = require('node-cron');
const { listFiles } = require('../utils/googleDriveServiceAccount');
const { saveFilesToSupabase } = require('../controllers/filesController'); // Supabase function to save files
const { fetchChannels, fetchMessages, saveChannelsToSupabase, saveMessagesToSupabase } = require('./slackService');
const { fetchJiraIssues, saveJiraIssuesToSupabase } = require('./jiraService');

// Sync Google Drive files to Supabase every hour
const syncGoogleDriveFiles = () => {
  cron.schedule('0 * * * * *', async () => { // Runs at the top of every hour
    console.log('Syncing Google Drive files to Supabase...');

    try {
      // Fetch the list of files from Google Drive
      const files = await listFiles();

      // Save the files metadata to Supabase
      await saveFilesToSupabase(files);

      console.log('Google Drive files successfully synced to Supabase.');
    } catch (error) {
      console.error('Error syncing files from Google Drive:', error);
    }
  });
};

// Sync Slack data every hour
const syncSlackData = () => {
  cron.schedule('5 * * * * *', async () => { // Runs every hour at the top of the hour
    console.log('Syncing Slack data...');

    try {
      // Fetch channels from Slack
      const channels = await fetchChannels();
      console.log("-----------------------------------------------------------------------------------------------------------------");
      // Save channels to Supabase
      await saveChannelsToSupabase(channels);

      // For each channel, fetch and save messages
      for (const channel of channels) {
        const messages = await fetchMessages(channel.id);
        await saveMessagesToSupabase(channel.id, messages);
      }

      console.log('Slack data successfully synced.');
    } catch (error) {
      console.error('Error syncing Slack data:', error);
    }
  });
};

const syncJiraData = () => {
  // Sync Jira issues every hour
  cron.schedule('10 * * * * *', async () => {
    console.log('Syncing Jira issues...');
    try {
      const issues = await fetchJiraIssues();
      await saveJiraIssuesToSupabase(issues);

      console.log('Jira issues synced successfully');
    } catch (error) {
      console.error('Error syncing Jira issues:', error);
    }
  });
};
// Export the function so it can be used in app.js
module.exports = { syncGoogleDriveFiles, syncSlackData, syncJiraData };

const axios = require('axios');
const supabase = require('../utils/supabaseClient');  // Assuming you have this for Supabase
const jiraToken = process.env.JIRA_API_TOKEN; // Store Jira token in the .env file
const jiraBaseURL = process.env.JIRA_BASE_URL; // Update with your Jira domain
const jiraEmailAddress = process.env.JIRA_EMAIL_ADDRESS;

// Initialize axios instance for Jira API with basic auth using Jira token
const jiraClient = axios.create({
  baseURL: jiraBaseURL + '/rest/api/3', // Jira API base URL
  headers: {
    'Authorization': `Basic ${Buffer.from(jiraEmailAddress + ':' + jiraToken).toString('base64')}`,
    'Content-Type': 'application/json',
  }
});

// Fetch Jira issues using the JQL (Jira Query Language)
const fetchJiraIssues = async (jql) => {
  try {
    const response = await jiraClient.get('/search', {
      params: {
        jql: jql, // Define your JQL to filter the issues
        maxResults: 50, // Optional, limit number of issues fetched
      }
    });

    return response.data.issues; // Return issues data
  } catch (error) {
    console.error('Error fetching Jira issues:', error);
    throw error;
  }
};

// Save or update issues in Supabase
const saveJiraIssuesToSupabase = async (issues) => {
  try {
    const { data, error } = await supabase
      .from('jira_issues') // Assuming you have a table to store Jira issues
      .upsert(
        issues.map((issue) => ({
          issue_id: issue.id,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          priority: issue.fields.priority.name,
          reporter: issue.fields.reporter.displayName,
          assignee: issue.fields.assignee ? issue.fields.assignee.displayName : null,
          created: issue.fields.created,
          updated: issue.fields.updated,
        })),
        { onConflict: ['issue_id'] }
      );

    if (error) {
      console.error('Error saving Jira issues to Supabase:', error);
      throw error;
    }

    return data; // Return saved issues data
  } catch (error) {
    console.error('Error saving Jira issues:', error);
    throw error;
  }
};


// Optionally, you can run this function periodically using a cron job
// syncJiraData(); // Uncomment to call immediately or schedule periodically

module.exports = {
  fetchJiraIssues,
  saveJiraIssuesToSupabase,
};

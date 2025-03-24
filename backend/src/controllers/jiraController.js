// src/controllers/jiraController.js
const supabase = require('../utils/supabaseClient');

const getJiraIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jira_issues')
      .select('*');

    if (error) {
      return res.status(400).json({ error: 'Error fetching Jira issues' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Jira issues from Supabase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getJiraIssues,
};

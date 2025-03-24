import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/axios'; // Assuming you have an axios instance set up

const JiraIssuesList = () => {
  const [issues, setIssues] = useState([]);  // Store Jira issues
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch Jira issues from backend (Supabase or any other API endpoint)
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/jira-issues'); // Backend API to fetch Jira issues
        setIssues(response.data); // Store issues in the state
      } catch (err) {
        console.error('Error fetching Jira issues:', err);
        setError('Error fetching Jira issues.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []); // Empty dependency array means this will run once when the component is mounted

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Jira Issues</h1>

      {/* Error message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        // Display Jira issues
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Issue ID</th>
                <th className="px-4 py-2 text-left">Summary</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Reporter</th>
                <th className="px-4 py-2 text-left">Assignee</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.issue_id} className="border-b">
                  <td className="px-4 py-2">{issue.issue_id}</td>
                  <td className="px-4 py-2">{issue.summary}</td>
                  <td className="px-4 py-2">{issue.status}</td>
                  <td className="px-4 py-2">{issue.priority}</td>
                  <td className="px-4 py-2">{issue.reporter}</td>
                  <td className="px-4 py-2">{issue.assignee || 'Unassigned'}</td>
                  <td className="px-4 py-2">{new Date(issue.created).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(issue.updated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JiraIssuesList;

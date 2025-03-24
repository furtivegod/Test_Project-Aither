import { useState, useEffect } from 'react';
import useAuthStore from '../../utils/useAuth'; // Import your Zustand store
import GoogleDriveTable from '../components/GoogleDriveTable';
import ChannelList from '../components/ChannelList';
import JiraIssuesList from '../components/JiraIssuesList';
import { apiClient } from '../../utils/axios';

const Dashboard = () => {
  const { token, removeAuth } = useAuthStore(); // Access the store
  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to get user info

  const [activeTab, setActiveTab] = useState('googleDrive'); // State for the active tab

  const logout = () => {
    removeAuth(); // Remove auth data from the store
    window.location.href = '/login'; // Redirect to login page
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'; // Redirect if not logged in
    }else{
      apiClient.get('auth/me');
      console.log(123);
    }
  }, [token]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (Tabs) */}
      <div className="bg-indigo-600 text-white p-4 w-64 flex-none h-screen flex flex-col">
        <div className="text-2xl font-bold mb-8">Dashboard</div>

        <div className="space-y-4">
          <button
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-700 ${activeTab === 'googleDrive' ? 'bg-indigo-700' : ''}`}
            onClick={() => setActiveTab('googleDrive')}
          >
            GoogleDrive Files
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-700 ${activeTab === 'slackChannel' ? 'bg-indigo-700' : ''}`}
            onClick={() => setActiveTab('slackChannel')}
          >
            Slack Channel Messages
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-700 ${activeTab === 'jiraIssues' ? 'bg-indigo-700' : ''}`}
            onClick={() => setActiveTab('jiraIssues')}
          >
            Jira Issues
          </button>
        </div>

        {/* Logout Button at the bottom of the sidebar */}
        <div className="mt-auto">
          <button
            style={{textAlign: 'center'}}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-500"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 space-y-6 max-w-screen-xl mx-auto">
        {/* GoogleDrive Files Section */}
        {activeTab === 'googleDrive' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-h-screen overflow-y-auto">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Messages of Slack Channel</div>
            <div className="flex-1 overflow-y-auto">
              <GoogleDriveTable />
            </div>
          </div>
        )}

        {/* Slack Channel Messages Section */}
        {activeTab === 'slackChannel' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-h-screen overflow-y-auto">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Messages of Slack Channel</div>
            <div className="flex-1 overflow-y-auto">
              <ChannelList />
            </div>
          </div>
        )}

        {/* Jira Issues Section */}
        {activeTab === 'jiraIssues' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-h-screen overflow-y-auto">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Messages of Slack Channel</div>
            <div className="flex-1 overflow-y-auto">
              <JiraIssuesList />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

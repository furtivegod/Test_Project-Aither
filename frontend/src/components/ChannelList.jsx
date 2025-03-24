import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/axios';

const SlackChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  // Fetch Slack channels
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await apiClient.get('/slack-channels'); // Backend API to fetch channels
        setChannels(response.data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    fetchChannels();
  }, []);

  // Fetch messages for the selected channel
  useEffect(() => {
    if (selectedChannelId) {
      const fetchMessages = async () => {
        try {
          const response = await apiClient.get(`/slack-channels/${selectedChannelId}`); // Backend API to fetch messages
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedChannelId]);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Channel List */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Channels</h2>
        <ul>
          {channels.map((channel) => (
            <li key={channel.slack_channel_id} className="mb-2">
              <button
                className="text-teal-600 font-bold hover:underline"
                onClick={() => setSelectedChannelId(channel.slack_channel_id)}
              >
                #{channel.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        {selectedChannelId && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Messages in{' '}
              {channels.find((ch) => ch.slack_channel_id === selectedChannelId)?.name}
            </h2>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span className="font-semibold">{message.user_name}</span>
                    <span>{new Date(message.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-lg text-gray-800">{message.message_text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlackChannelList;

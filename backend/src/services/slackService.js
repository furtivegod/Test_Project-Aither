const { WebClient } = require('@slack/web-api');
const supabase = require('../utils/supabaseClient');  // Assuming supabaseClient.js exists
const slackToken = process.env.SLACK_OAUTH_TOKEN; // Store your token in the .env file
const slackClient = new WebClient(slackToken);


const getUserInfo = async (userId) => {
  try {
    const response = await slackClient.users.info({ user: userId });
    if (response.ok) {
      return response.user.profile.display_name || response.user.real_name; // Return display name or real name
    } else {
      throw new Error('Error fetching user info');
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// Fetch all channels from Slack
const fetchChannels = async () => {
  try {
    if(!slackToken) {
     console.log("Slack token is not set");
     return;
    }else{
        const res = await slackClient.conversations.list({
            types: 'public_channel, private_channel', // Modify based on the type of channels you want
          });
      
        return res.channels;
    }
  } catch (error) {
    console.error('Error fetching Slack channels:', error);
    throw error;
  }
};

// Fetch messages for a given Slack channel
const fetchMessages = async (channelId) => {
  try {
    const res = await slackClient.conversations.history({
      channel: channelId,
    });

    const messagesWithUserNames = await Promise.all(
      res.messages.map(async (message) => {
        if (message.user) {
          const userName = await getUserInfo(message.user); // Fetch user name
          return {
            ...message,
            user_name: userName, // Add user name to message
          };
        }
        return message;
      })
    );

    return messagesWithUserNames;
  } catch (error) {
    console.error('Error fetching Slack messages:', error);
    throw error;
  }
};

// Save or update channels in Supabase
const saveChannelsToSupabase = async (channels) => {
  try {
    const { data, error } = await supabase
      .from('slack_channels')
      .upsert(
        channels.map((channel) => ({
          slack_channel_id: channel.id,
          name: channel.name,
        })),
        { onConflict: ['slack_channel_id'] }
      );

    if (error) {
      console.error('Error saving channels:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving Slack channels:', error);
    throw error;
  }
};

// Save messages to Supabase for a given channel
const saveMessagesToSupabase = async (channelId, messages) => {
  try {
    const { data, error } = await supabase
      .from('slack_messages')
      .upsert(
        messages.map((msg) => ({
          slack_channel_id: channelId,
          message_id: msg.ts,
          user_id: msg.user,
          user_name: msg.user_name,
          message_text: msg.text,
          timestamp: new Date(parseFloat(msg.ts) * 1000), // Convert to proper timestamp
        })),
        { onConflict: ['message_id'] }
      );

    if (error) {
      console.error('Error saving messages:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving Slack messages:', error);
    throw error;
  }
};

module.exports = {
  fetchChannels,
  fetchMessages,
  saveChannelsToSupabase,
  saveMessagesToSupabase,
};

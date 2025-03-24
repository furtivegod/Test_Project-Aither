const supabase = require('../utils/supabaseClient');

// Get Slack Channels from Supabase
const getSlackChannels = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('slack_channels') // Assuming the table is called slack_channels
      .select('*'); // Get all columns

    if (error) {
      console.error('Error fetching channels:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data); // Send the fetched data to the frontend
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Messages for a specific channel from Supabase
const getMessagesForChannel = async (req, res) => {
  const { channelId } = req.params; // Get the channelId from the request params
  try {
    const { data, error } = await supabase
      .from('slack_messages') // Assuming the table is called slack_messages
      .select('*')
      .eq('slack_channel_id', channelId); // Filter by the channelId

    if (error) {
      console.error('Error fetching messages:', error);                                                             
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data); // Send the fetched messages to the frontend
  } catch (error) {
    console.error('Error fetching messages from Supabase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSlackChannels,
  getMessagesForChannel,
};

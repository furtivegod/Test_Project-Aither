// src/utils/googleDriveServiceAccount.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Path to your service account credentials file
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT;

// Initialize the Google Auth client with the service account
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_KEY_PATH,
  scopes: ['https://www.googleapis.com/auth/drive'], // full access
});

// Initialize the Google Drive API client
const drive = google.drive({ version: 'v3', auth });

// Fetch list of files from Google Drive
const listFiles = async () => {
  let allFiles = [];
  let pageToken = null;

  try {
    let count = 0;
    do{
      const res = await drive.files.list({
        pageSize: 10, // Change this as per your requirement
        fields: 'nextPageToken, files(id, name, modifiedTime, webContentLink)',
        pageToken: pageToken,
      });
      console.log(count + ' token : ' + pageToken + '\n');

      allFiles = [...allFiles, ...res.data.files];
      pageToken = res.data.nextPageToken;
      console.log(count + ' next_token : ' + pageToken + '\n');
    }while(pageToken);

    return allFiles;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};


const downloadFile = async (fileId) => {
  try {
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType'
    });
    const res = await drive.files.get(
      { 
        fileId: fileId, 
        alt: 'media' 
      },
      { responseType: 'stream' }
    );
    return {
      fileStream: res.data,
      fileName: fileMetadata.data.name,
      mimeType: fileMetadata.data.mimeType
    };  // Returns the file as a stream
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

// Upload file to Google Drive
const uploadFile = async (filePath, mimeType, fileName) => {
  try {
    // Create a media object containing the file content
    const fileMetadata = {
      name: fileName, // The file's name in Google Drive
    };

    const media = {
      mimeType: mimeType, // Mime type of the file (e.g., 'image/png', 'application/pdf')
      body: fs.createReadStream(filePath), // The file stream (read the file from disk)
    };

    // Upload file to Google Drive
    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id', // We only need the file's ID in response
    });

    console.log('File uploaded successfully. File ID:', res.data.id);

    return res.data.id; // Return the file ID of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

// const setFilePermissionsForAnyone = async (fileId) => {
//   const permission = {
//     'type': 'anyone',  // This allows anyone to access the file
//     'role': 'reader',  // 'reader' allows anyone to view, 'writer' allows editing
//   };

//   try {
//     await drive.permissions.create({
//       fileId: fileId,
//       resource: permission,
//     });
//     console.log('File is now accessible by anyone.');
//   } catch (error) {
//     console.error('Error setting permission:', error);
//     throw new Error('Permission setting failed');
//   }
// };


// const transferOwnership = async (fileId, emailAddress) => {
//   const permission = {
//     'type': 'user',  // This specifies that the permission is for a user
//     'role': 'owner', // Grant ownership of the file
//     'emailAddress': emailAddress,  // Your Google account email address
//   };

//   try {
//     await drive.permissions.create({
//       fileId: fileId,
//       resource: permission,
//       transferOwnership: true,  // Must be a query parameter for ownership transfer
//     });
//     console.log('Ownership transferred to', emailAddress);
//   } catch (error) {
//     console.error('Error transferring ownership:', error);
//     throw new Error('Ownership transfer failed');
//   }
// };

// Share file with a specific user
// This function allows you to share a file with a specific user by email address
const shareFileWithUser = async (fileId, emailAddress) => {
  const permission = {
    type: 'user',
    role: 'writer', // Can be 'reader' for view-only access or 'writer' for editing
    emailAddress: emailAddress,  // Your personal Google account email address
  };

  try {
    // Create the permission to share the file
    await drive.permissions.create({
      fileId: fileId,
      resource: permission,
    });
    console.log('File shared successfully with:', emailAddress);
  } catch (error) {
    console.error('Error sharing file:', error);
  }
};




module.exports = {
  listFiles,
  downloadFile,
  uploadFile,
  shareFileWithUser,
  // setFilePermissionsForAnyone,
  // transferOwnership,
};

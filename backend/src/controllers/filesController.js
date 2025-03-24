const supabase = require('../utils/supabaseClient');
const {downloadFile, uploadFile, shareFileWithUser} = require('../utils/googleDriveServiceAccount');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer setup for storing files temporarily in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Temporary file storage location
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  },
});
const upload = multer({ storage: storage });


// Save files metadata to Supabase database
const saveFilesToSupabase = async (files) => {
    try {
      const { data, error } = await supabase
        .from('google_drive_files') // Assuming you have a 'google_drive_files' table
        .upsert(files.map((file) => ({
          file_id: file.id,
          file_name: file.name,
          modified_time: file.modifiedTime,
          web_content_link: file.webContentLink
        })),
      {onConflict : ['file_id']})
  
      if (error) {
        throw error;
      }
  
      console.log('Files saved to Supabase:', data);
    } catch (error) {
      console.error('Error saving files to Supabase:', error);
      throw error;
    }
  };
  
  module.exports = {
    saveFilesToSupabase,
  };

  const getFiles = async (req, res) => {
    const { page = 1, pageSize = 10, sortColumn = 'file_name', sortDirection = 'asc', filter = '' } = req.query;
    console.log(page, pageSize, sortColumn, sortDirection, filter);

    try {
      const offset = (page - 1) * pageSize; // Calculate offset for pagination
  
      // Build the query
      let query = supabase
        .from('google_drive_files')
        .select('*', {count : 'exact'})
        .ilike('file_name', `%${filter}%`) // Filter by file_name (case-insensitive)
        .order(sortColumn, { ascending: sortDirection === 'asc' })
        .range(offset, offset + pageSize - 1); // Set range for pagination
  
      const { data, error, count } = await query;
      console.log(count);
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      // Calculate total pages based on count
      const totalPages = Math.ceil(count / pageSize) ? Math.ceil(count/pageSize) : 1;
  
      res.status(200).json({ files: data, totalPages , totalRecords : count});
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Handle the file download
const downloadFileController = async (req, res) => {
  const { fileId } = req.body;  // Get the file ID from the request body
  console.log(fileId);

  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const {fileStream, fileName, mimeType} = await downloadFile(fileId);
    console.log(fileName, mimeType);
    // Set the appropriate headers for file download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    // Pipe the file stream to the response
    fileStream.pipe(res);

    fileStream.on('end', () => {
      console.log('File download completed');
    });

    fileStream.on('error', (err) => {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).send('Error accessing Google Drive');
  }
};

const uploadFileController = async (req, res) => {
  const { file } = req; // Assuming file is sent in the request

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Call the uploadFile function to upload the file to Google Drive
    const filePath = file.path; // File path (the path where the file is temporarily stored)
    const mimeType = file.mimetype; // MIME type of the file
    const fileName = file.originalname; // Original file name

    console.log(filePath, mimeType, fileName);

    // Upload the file to Google Drive and get the file ID
    const googleDriveFileId = await uploadFile(filePath, mimeType, fileName);

    await shareFileWithUser(googleDriveFileId, process.env.GOOGLE_DRIVE_EMAIL);

    // await setFilePermissionsForAnyone(googleDriveFileId); // Set file permissions to public

    // await transferOwnership(googleDriveFileId, 'kendrickjhaymon1002@gmail.com'); // Transfer ownership to the service account

    // // Save file metadata to Supabase
    // const fileMetadata = {
    //   file_id: googleDriveFileId,
    //   file_name: fileName,
    //   mime_type: mimeType,
    //   created_at: new Date(),
    // };
    
    // await saveFilesToSupabase([fileMetadata]);

    fs.unlinkSync(filePath);

    res.status(200).json({ fileId: googleDriveFileId, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};

module.exports = {
    getFiles,
    saveFilesToSupabase,
    downloadFileController,
    uploadFileController
}

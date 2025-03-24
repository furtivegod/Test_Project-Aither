import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/axios';

const GoogleDriveTable = () => {
  const [files, setFiles] = useState([]); // Store files from API
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [totalRecords, setTotalRecords] = useState(0); // Total records count
  const [pageSize, setPageSize] = useState(10); // Number of items per page (default 10)
  const [sortColumn, setSortColumn] = useState('file_name'); // Default sort column
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction
  const [filter, setFilter] = useState(''); // Filter input state
  const [isUploading, setIsUploading] = useState(false); // To track file upload progress

  // Fetch files from backend with pagination, sorting, and filtering
  const fetchFiles = async (page = 1) => {
    try {
      const response = await apiClient.get('/files', {
        params: {
          page,
          pageSize,
          sortColumn,
          sortDirection,
          filter,
        },
      });
      setFiles(response.data.files);
      setTotalPages(response.data.totalPages); // Set total pages from the response
      setTotalRecords(response.data.totalRecords); // Set total records count
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent invalid page numbers
    setPage(newPage);
  };

  // Handle sorting
  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Handle filter change
  const handleFilter = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to page 1 when filter changes
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to page 1 when page size changes
  };

  // Handle file download
  const handleDownload = async (fileId) => {
    try {
      const response = await apiClient.post('/download', { fileId }, { responseType: 'blob' });
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '') // Get filename from the header
        : 'downloaded-file';
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);  // Create an object URL for the blob
      link.download = fileName; // Set the download attribute with the correct filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true); // Start the upload process
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await apiClient.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('File uploaded successfully:', response.data);
        // Optionally, refresh the file list after upload
        fetchFiles(page);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false); // Stop the upload process
      }
    }
  };

  useEffect(() => {
    fetchFiles(page);
  }, [page, sortColumn, sortDirection, filter, pageSize]);

  return (
    <div className="container mx-auto p-4">
      {/* File Upload Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="file"
          onChange={handleFileUpload}
          className="border p-2 rounded-md"
          disabled={isUploading} // Disable while uploading
        />
        {isUploading && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md"
            disabled
          >
            <svg
              className="mr-3 w-5 h-5 text-white animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0"
              />
            </svg>
            Processing...
          </button>
        )}
      </div>

      {/* Search and Pagination */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={handleFilter}
          className="border p-2 rounded-md w-1/3"
        />
        <div className="flex space-x-2 items-center">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border px-4 py-2 rounded-md"
          >
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
            <option value="100">100 rows</option>
          </select>
          <div>
            <p>{totalRecords} records</p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('file_name')}
              >
                File Name
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('modified_time')}
              >
                Modified Time
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('web_content_link')}
              >
                Download
              </th>
            </tr>
          </thead>
          <tbody className="max-h-96 overflow-y-auto text-center">
            {files.map((file) => (
              <tr key={file.file_id} className="border-b">
                <td className="px-4 py-2">{file.file_name}</td>
                <td className="px-4 py-2">
                  {new Date(file.modified_time).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDownload(file.file_id)} // Trigger the download when clicked
                    className="text-blue-500 hover:underline"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            className="border px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <button
            className="border px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveTable;

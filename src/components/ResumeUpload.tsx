/**
 * ResumeUpload Component
 * 
 * Allows users to upload a resume file (PDF or DOCX) for job matching
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Component props interface
interface ResumeUploadProps {
  onUpload: (file: File) => void;  // Function to handle file upload
  isLoading: boolean;              // Loading state indicator
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload, isLoading }) => {
  // State for selected file and validation errors
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection
   * Validates file type and size
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['pdf', 'docx', 'doc'].includes(fileExt)) {
        setError('Please upload a PDF or Word document (docx, doc)');
        setSelectedFile(null);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  /**
   * Handle file upload submission
   */
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  /**
   * Trigger file browser dialog when the drop area is clicked
   */
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Find Jobs by Uploading Your Resume
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Upload your resume and our AI will analyze your skills and experience to find the most relevant job matches.
      </Typography>
      
      {/* File upload drop area */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={handleBrowseClick}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.doc"
          onChange={handleFileChange}
        />
        
        {/* Display selected file info or upload instructions */}
        {selectedFile ? (
          <>
            <InsertDriveFileIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </Typography>
          </>
        ) : (
          <>
            <UploadFileIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Drag and drop your resume here
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to browse files
            </Typography>
          </>
        )}
      </Paper>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Upload button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <CloudUploadIcon />}
        onClick={handleUpload}
        disabled={isLoading || !selectedFile}
        fullWidth
      >
        {isLoading ? 'Analyzing Resume...' : 'Upload and Find Jobs'}
      </Button>
    </Box>
  );
};

export default ResumeUpload;
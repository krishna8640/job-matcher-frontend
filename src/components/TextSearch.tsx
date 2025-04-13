/**
 * TextSearch Component
 * 
 * Allows users to search for jobs by entering text queries
 */

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Component props interface
interface TextSearchProps {
  onSearch: (query: string) => void;  // Function to handle search submission
  isLoading: boolean;                 // Loading state indicator
}

const TextSearch: React.FC<TextSearchProps> = ({ onSearch, isLoading }) => {
  // Local state for query input
  const [query, setQuery] = useState('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Find Jobs by Skills, Title, or Description
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Enter job title, skills, or keywords to find matching opportunities. Our AI will analyze your query and find the most relevant job matches.
      </Typography>
      
      {/* Text input field */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Search Query"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Example: Senior Python Developer with 5 years experience in machine learning and AWS"
        sx={{ mb: 2 }}
      />
      
      {/* Search button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading || !query.trim()}
        startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
      >
        {isLoading ? 'Searching...' : 'Search Jobs'}
      </Button>
    </Box>
  );
};

export default TextSearch;
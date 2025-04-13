/**
 * AI Job Matcher - Main Application Component
 * 
 * This is the entry point for the application UI, which includes:
 * - Tabs for text search and resume upload
 * - State management for search results
 * - API communication
 * - Pagination for search results
 */

import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  CssBaseline,
  Alert,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

// Import components
import TextSearch from './components/TextSearch';
import ResumeUpload from './components/ResumeUpload';
import JobResults from './components/JobResults';

// Import types
import { JobResult } from './types';

// Create a theme with primary and secondary colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',  // Indigo
    },
    secondary: {
      main: '#f50057',  // Pink
    },
  },
});

const App: React.FC = () => {
  // State variables
  const [tabValue, setTabValue] = useState(0);  // 0 = Text Search, 1 = Resume Upload
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<JobResult[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastQuery, setLastQuery] = useState('');
  
  // Cache for search results to improve performance
  const [cachedResults, setCachedResults] = useState<Record<string, any>>({});
  
  // Last uploaded resume file for pagination with resume search
  const [lastResumeFile, setLastResumeFile] = useState<File | null>(null);

  // API base URL - change this based on your backend deployment
  const API_BASE_URL = 'http://localhost:8000';

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  /**
   * Handle text search submission with pagination
   * @param query - Text query for job search
   * @param page - Page number to fetch (default: 1)
   */
  const handleTextSearch = async (query: string, page = 1) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    // Set the current query and page
    setLastQuery(query);
    setCurrentPage(page);
    
    const cacheKey = `${query}_${page}`;
    
    // Check if we have cached results for this query and page
    if (cachedResults[cacheKey]) {
      setResults(cachedResults[cacheKey].results);
      setTotalPages(cachedResults[cacheKey].total_pages || Math.ceil(cachedResults[cacheKey].total / 10));
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Using GET request for text search with pagination
      const response = await fetch(
        `${API_BASE_URL}/search/text?query=${encodeURIComponent(query)}&page=${page}&limit=10`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to search jobs');
      }

      const data = await response.json();
      
      // Cache the results
      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: data
      }));
      
      setResults(data.results);
      setTotalPages(data.total_pages || Math.ceil(data.total / 10));
      
      setNotification(`Found ${data.total || data.results.length} matching jobs for your query`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle resume upload and search
   * @param file - Resume file (PDF or DOCX)
   * @param page - Page number to fetch (default: 1)
   */
  const handleResumeUpload = async (file: File, page = 1) => {
    setIsLoading(true);
    setError(null);
    setLastResumeFile(file);
    setCurrentPage(page);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('limit', '10');
    formData.append('page', page.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/search/resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process resume');
      }

      const data = await response.json();
      setResults(data.results);
      setTotalPages(data.total_pages || Math.ceil(data.total / 10));
      
      setNotification(`Found ${data.total || data.results.length} matching jobs based on your resume`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle page change for results pagination
   * @param newPage - New page number to fetch
   */
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    
    if (tabValue === 0 && lastQuery) {
      // Text search pagination
      handleTextSearch(lastQuery, newPage);
    } else if (tabValue === 1 && lastResumeFile) {
      // Resume search pagination
      handleResumeUpload(lastResumeFile, newPage);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <WorkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Job Matcher
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Search Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Text Search" id="tab-0" />
            <Tab label="Resume Upload" id="tab-1" />
          </Tabs>
          
          {/* Tab Content */}
          <Box p={3}>
            {tabValue === 0 && (
              <TextSearch onSearch={handleTextSearch} isLoading={isLoading} />
            )}
            
            {tabValue === 1 && (
              <ResumeUpload onUpload={handleResumeUpload} isLoading={isLoading} />
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
        
        {/* Loading Indicator */}
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Results with Pagination */}
        {!isLoading && results.length > 0 && (
          <JobResults 
            results={results}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        
        {/* Empty State */}
        {!isLoading && results.length === 0 && !error && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              Search for jobs or upload your resume to find matches
            </Typography>
          </Paper>
        )}
      </Container>
      
      {/* Notification */}
      <Snackbar
        open={notification !== null}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        message={notification}
      />
    </ThemeProvider>
  );
};

export default App;
/**
 * JobResults Component
 * 
 * Displays job search results with details and match percentages
 * Optimized for Material UI v7 and React 19
 * Includes pagination support
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  Timeline as TimelineIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { JobResult } from '../types';

// Updated component props interface with pagination
interface JobResultsProps {
  results: JobResult[];  // Array of job results to display
  currentPage: number;   // Current page number
  totalPages: number;    // Total number of pages
  onPageChange: (page: number) => void; // Page change handler
}

const JobResults: React.FC<JobResultsProps> = ({ 
  results, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // State for selected job to show in detail view
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null);
  
  /**
   * Format job match percentage from decimal to integer percentage
   */
  const formatMatchPercentage = (score: number): number => {
    return Math.round(score * 100);
  };

  /**
   * Handle job card click to show job details
   */
  const handleJobClick = (job: JobResult) => {
    setSelectedJob(job);
  };

  /**
   * Close job details dialog
   */
  const handleClose = () => {
    setSelectedJob(null);
  };

  return (
    <>
      {/* Results header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Job Matches ({results.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Jobs are sorted by match percentage based on your search
        </Typography>
      </Box>

      {/* Job Cards */}
      <Stack spacing={2}>
        {results.map((job) => (
          <Card 
            key={job.job_id} 
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3,
              },
            }}
            onClick={() => handleJobClick(job)}
          >
            <CardContent>
              {/* Job Title and Match Score */}
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", 
                mb: 1 
              }}>
                <Typography variant="h6" component="div">
                  {job.title}
                </Typography>
                <Chip 
                  label={`${formatMatchPercentage(job.similarity_score)}% Match`}
                  color={job.similarity_score > 0.8 ? "success" : job.similarity_score > 0.6 ? "primary" : "default"}
                  size="small"
                />
              </Box>
              
              {/* Job Details */}
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  flexWrap: "wrap", 
                  mb: 2,
                  gap: 2
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.company}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
                
                {job.job_type !== "Not specified" && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.job_type}
                    </Typography>
                  </Box>
                )}
                
                {job.salary_range !== "Not specified" && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.salary_range}
                    </Typography>
                  </Box>
                )}
              </Stack>
              
              {/* Description Preview */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {job.description_preview}
              </Typography>
            </CardContent>
            
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

      {/* Pagination Controls - New Section */}
      {totalPages > 1 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mt: 4, 
            mb: 2 
          }}
        >
          <Button
            startIcon={<PrevIcon />}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            sx={{ mx: 1 }}
            color="primary"
            variant="outlined"
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              // Calculate which pages to show
              let pageNum: number; // Fixed: Added type annotation
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'contained' : 'outlined'}
                  onClick={() => onPageChange(pageNum)}
                  sx={{ 
                    minWidth: '40px', 
                    mx: 0.5,
                    fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                  }}
                  color="primary"
                >
                  {pageNum}
                </Button>
              );
            })}
          </Box>
          
          <Button
            endIcon={<NextIcon />}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            sx={{ mx: 1 }}
            color="primary"
            variant="outlined"
          >
            Next
          </Button>
        </Box>
      )}

      {/* Job Details Dialog */}
      <Dialog
        open={selectedJob !== null}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedJob && (
          <>
            <DialogTitle>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <Typography variant="h6">{selectedJob.title}</Typography>
                <IconButton 
                  edge="end" 
                  color="inherit" 
                  onClick={handleClose} 
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              {/* Company and Location - Full Width */}
              <Box sx={{ mb: 2 }}>
                <Stack 
                  direction="row" 
                  spacing={3} 
                  sx={{ 
                    flexWrap: "wrap",
                    mb: 2
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {selectedJob.company}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {selectedJob.location}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              {/* Two Columns Layout for Details and Score */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                {/* Job Details Column */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    flex: 1
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Job Details
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Type:</strong> {selectedJob.job_type}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Salary:</strong> {selectedJob.salary_range}
                    </Typography>
                  </Box>
                </Paper>
                
                {/* Match Score Column */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    flex: 1
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    AI Match Score
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TimelineIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Match:</strong> {formatMatchPercentage(selectedJob.similarity_score)}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={formatMatchPercentage(selectedJob.similarity_score)} 
                    color={selectedJob.similarity_score > 0.8 ? "success" : selectedJob.similarity_score > 0.6 ? "primary" : "warning"}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Paper>
              </Stack>
              
              {/* Job Description - Full Width */}
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Job Description
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {selectedJob.description}
                </Typography>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  // Open the job application URL in a new tab
                  if (selectedJob && selectedJob.url){
                    window.open(selectedJob.url, '_blank');
                  } else {
                    alert('Application link not available for this job');
                  }
                }}
              >
                Apply Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default JobResults;
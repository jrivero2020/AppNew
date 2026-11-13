import React from 'react';
import { Card, CardActionArea,  Box, Typography } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';

const DocumentCard = ({ title, description, icon, onClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: 1,
        border: '1px solid #E0E0E0',
        transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          borderColor: '#1976d2',
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#E3F2FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            transition: 'transform 0.3s ease',
            '.MuiCardActionArea-root:hover &': {
              transform: 'scale(1.1)',
            },
          }}
        >
          {icon || <DescriptionIcon sx={{ fontSize: 40, color: '#1976d2' }} />}
        </Box>

        <Typography
          variant="h6"
          component="h3"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#333333',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.5em',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default DocumentCard;

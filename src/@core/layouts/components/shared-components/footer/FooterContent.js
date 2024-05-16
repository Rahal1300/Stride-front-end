import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const FooterContent = () => {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, ${t('Made_with')} `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` ${t('by')} `}
        <Link target='_blank' href='https://hk.com.tn/'>
          Stride
        </Link>
      </Typography>
    </Box>
  );
};

export default FooterContent;

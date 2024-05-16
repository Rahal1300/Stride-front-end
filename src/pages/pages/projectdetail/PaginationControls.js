import React from 'react';
import Button from '@mui/material/Button';

const PaginationControls = ({ currentPage, handlePageChange, endIndex, totalItems }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Button sx={{ mr: '8px' }} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>{'<'}</Button>
    <span style={{ margin: '0 8px', fontWeight: 'bold' }}>{currentPage}</span>
    <Button sx={{ ml: '8px' }} disabled={endIndex >= (totalItems || 0)} onClick={() => handlePageChange(currentPage + 1)}>{'>'}</Button>
  </div>
);

export default PaginationControls;

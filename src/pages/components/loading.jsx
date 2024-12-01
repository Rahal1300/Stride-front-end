import { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
  const [loading, setLoading] = useState(true);


  return (
    <div>
      
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={70} />
        </div>
      )}
    </div>
  );
};

export default Loading;

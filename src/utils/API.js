// ./src/pages/utils/API.js
import { useQuery } from 'react-query';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

const useFetchNotifications = (token) => {
  return useQuery(['notifications', token], async () => {
    const response = await fetch(`${BASE_URL}/notifications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching notifications');
    }

    return response.json();
  });
};

const useFetchTimelineData = (token) => {
  return useQuery(['timeline', token], async () => {
    const response = await fetch(`${BASE_URL}/5/timeline`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching timeline data');
    }

    return response.json();
  }, {
    enabled: false, // Disable automatic fetching on component mount
  });
};

const useNotifications = (userToken) => {
  return useQuery('notifications', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching notifications');
    }

    const data = await response.json();
    return data;
  });
};
const useHasProject = (userToken) => {
  return useQuery('hasProject', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/has_projects`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching project status');
    }

    const data = await response.json();
    return data;
  });
};
export { useFetchNotifications, useFetchTimelineData, useNotifications,useHasProject };

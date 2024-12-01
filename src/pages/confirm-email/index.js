import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Link from '@mui/material/Link';

function EmailConfirmationPage() {
    const router = useRouter();
    const { token } = router.query;
    const [confirmationStatus, setConfirmationStatus] = useState('Confirming...');

    useEffect(() => {
        if (token) {
            // Send a request to the backend to confirm the email using the token
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/confirm-email?token=${token}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setConfirmationStatus('Email confirmed successfully.');
                    } else {
                        setConfirmationStatus('Email confirmation failed.');
                    }
                })
                .catch(error => {
                    setConfirmationStatus('An error occurred during confirmation.');
                });
        } else {
            setConfirmationStatus('Token not found.');
        }
    }, [token]);
  
    return (
        <div className="fixed top-0 right-0 left-0 flex items-center justify-center w-full h-screen z-50 overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-800">
          <div className="relative max-w-md w-full p-4 bg-white rounded-lg shadow sm:p-5">
            <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              🎉 Successfully confirmed email. Now you can{' '}
           
              <Link href="/pages/login" className="text-primary-600 hover:text-primary-700 underline">
              log in        </Link>
              {' '}
              using the link below.
            </p>
          </div>
        </div>
      );
      
}
EmailConfirmationPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default EmailConfirmationPage;

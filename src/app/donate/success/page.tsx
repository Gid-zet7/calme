'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/trpc/react';

const DonateSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [donation, setDonation] = useState<any>(null);

  const verifyPayment = api.donations.verifyPayment.useMutation({
    onSuccess: (data) => {
      setVerificationStatus(data.success ? 'success' : 'failed');
      setDonation(data.donation);
    },
    onError: () => {
      setVerificationStatus('failed');
    },
  });

  useEffect(() => {
    if (reference) {
      verifyPayment.mutate({ reference });
    } else {
      setVerificationStatus('failed');
    }
  }, [reference]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-700 to-primary-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center"
      >
        {verificationStatus === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">Verifying Payment</h1>
            <p className="text-neutral-600">Please wait while we verify your donation...</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Thank You!</h1>
            <p className="text-neutral-600 mb-6">
              Your donation has been successfully processed. Your generosity makes a real difference in providing 
              mental health services to those who need it most.
            </p>
            
            {donation && (
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary-800 mb-2">Donation Details</h3>
                <p className="text-sm text-neutral-600">
                  Amount: ${donation.amount} {donation.currency}
                </p>
                <p className="text-sm text-neutral-600">
                  Reference: {donation.transactionId}
                </p>
                <p className="text-sm text-neutral-600">
                  Date: {new Date(donation.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              <span className="text-neutral-600">Your impact is already being felt</span>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
              >
                Return to Home
              </Link>
              <Link
                href="/donate"
                className="block w-full border border-primary-600 text-primary-600 py-3 px-6 rounded-md hover:bg-primary-50 transition-colors"
              >
                Make Another Donation
              </Link>
            </div>
          </>
        )}

        {verificationStatus === 'failed' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Payment Verification Failed</h1>
            <p className="text-neutral-600 mb-6">
              We were unable to verify your payment. Please contact our support team if you believe this is an error.
            </p>
            
            <div className="space-y-3">
              <Link
                href="/donate"
                className="block w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/contact"
                className="block w-full border border-primary-600 text-primary-600 py-3 px-6 rounded-md hover:bg-primary-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default DonateSuccessPage;

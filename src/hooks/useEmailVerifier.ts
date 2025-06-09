import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddresses, emailVerifierABI } from '../config/contracts';
import toast from 'react-hot-toast';

export const useEmailVerifier = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Email verification data
  const { data: isVerifiedData } = useReadContract({
    address: contractAddresses.emailVerifier as `0x${string}`,
    abi: emailVerifierABI,
    functionName: 'isEmailVerified',
    args: address ? [address as `0x${string}`, '0x0000000000000000000000000000000000000000000000000000000000000000'] : undefined,
  });

  // Verification timestamp data
  const { data: verificationTimestampData } = useReadContract({
    address: contractAddresses.emailVerifier as `0x${string}`,
    abi: emailVerifierABI,
    functionName: 'getVerificationTimestamp',
    args: address ? [address as `0x${string}`, '0x0000000000000000000000000000000000000000000000000000000000000000'] : undefined,
  });

  // Verified wallet data
  const { data: verifiedWalletData } = useReadContract({
    address: contractAddresses.emailVerifier as `0x${string}`,
    abi: emailVerifierABI,
    functionName: 'getVerifiedWallet',
    args: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
  });

  // Check if email is verified
  const isEmailVerified = useCallback(
    () => {
      // This is a mock implementation that would need to be replaced with a proper implementation
      // that doesn't call hooks inside a callback
      return { 
        isVerified: isVerifiedData, 
        isLoading: false 
      };
    },
    [isVerifiedData]
  );

  // Get verification timestamp
  const getVerificationTimestamp = useCallback(
    () => {
      // This is a mock implementation that would need to be replaced with a proper implementation
      // that doesn't call hooks inside a callback
      return { 
        timestamp: verificationTimestampData, 
        isLoading: false 
      };
    },
    [verificationTimestampData]
  );

  // Get verified wallet for an email hash
  const getVerifiedWallet = useCallback(
    () => {
      // This is a mock implementation that would need to be replaced with a proper implementation
      // that doesn't call hooks inside a callback
      return { 
        wallet: verifiedWalletData, 
        isLoading: false 
      };
    },
    [verifiedWalletData]
  );

  // Verify email
  const verifyEmail = useCallback(
    async (emailHash: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.emailVerifier as `0x${string}`,
          abi: emailVerifierABI,
          functionName: 'verifyEmail',
          args: [address as `0x${string}`, emailHash as `0x${string}`],
        });

        toast.success('Email verified successfully');
      } catch (error) {
        console.error('Verify email error:', error);
        toast.error('Failed to verify email');
      }
    },
    [address, writeContractAsync]
  );

  // Revoke email verification
  const revokeEmailVerification = useCallback(
    async (emailHash: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.emailVerifier as `0x${string}`,
          abi: emailVerifierABI,
          functionName: 'revokeEmailVerification',
          args: [address as `0x${string}`, emailHash as `0x${string}`],
        });

        toast.success('Email verification revoked successfully');
      } catch (error) {
        console.error('Revoke email verification error:', error);
        toast.error('Failed to revoke email verification');
      }
    },
    [address, writeContractAsync]
  );

  return {
    // Helper functions
    isEmailVerified,
    getVerificationTimestamp,
    getVerifiedWallet,
    
    // Write functions
    verifyEmail,
    revokeEmailVerification,
    
    // Loading states
    isWritePending,
  };
};

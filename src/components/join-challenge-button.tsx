import { useState, useCallback } from 'react';
import { useAuthContext, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { challengeService } from '@/lib/challengeService';
import { solanaClient } from '@/lib/solanaClient';
import { userService } from '@/lib/userService';
import { toast } from 'sonner';

interface JoinChallengeButtonProps {
  challengeId: string;
  entryFee: number;
  title: string;
  isDisabled?: boolean;
  onSuccess?: () => void;
}

export default function JoinChallengeButton({ 
  challengeId, 
  entryFee, 
  title,
  isDisabled = false,
  onSuccess
}: JoinChallengeButtonProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleJoinClick = useCallback(() => {
    // Open the confirmation dialog
    setShowDialog(true);
    setError(null);
    setIsSuccess(false);
  }, []);
  
  const handleJoinChallenge = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user?.id) {
        throw new Error('You must be logged in to join a challenge');
      }
      
      if (!user?.walletAddress) {
        throw new Error('You must connect your Solana wallet before joining challenges');
      }
      
      // Call the challenge service to join the challenge
      await challengeService.joinChallenge(user.id, challengeId, user.walletAddress);
      
      // Mark as success
      setIsSuccess(true);
      
      // Show success toast
      toast.success(`You've successfully joined ${title}`);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error joining challenge:', err);
      setError(err.message || 'Failed to join challenge');
      
      toast.error(err.message || 'Failed to join challenge');
    } finally {
      setLoading(false);
    }
  }, [user, challengeId, title, toast, onSuccess]);
  
  const closeDialog = useCallback(() => {
    setShowDialog(false);
    
    // If the join was successful, we may want to refresh the page or update the UI
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);
  
  // Render nothing if user is not logged in
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={handleJoinClick}
        disabled={isDisabled || loading || !user.walletAddress}
        className="w-full"
      >
        Join Challenge
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Challenge</DialogTitle>
            <DialogDescription>
              You are about to join "{title}" with an entry fee of {entryFee} SOL.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSuccess ? (
            <Alert variant="success" className="my-4">
              <CheckCircledIcon className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                You have successfully joined the challenge! The entry fee has been processed through your Solana wallet.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {!user.walletAddress && (
                <Alert variant="warning" className="my-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Wallet Required</AlertTitle>
                  <AlertDescription>
                    You need to connect your Solana wallet before joining this challenge.
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-sm text-muted-foreground mt-4">
                By joining this challenge, you'll pay an entry fee of {entryFee} SOL. This amount will be transferred from your wallet to the challenge's prize pool.
              </p>
            </>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            {isSuccess ? (
              <Button onClick={closeDialog}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowDialog(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleJoinChallenge} 
                  disabled={loading || !user.walletAddress}
                >
                  {loading ? "Processing..." : "Confirm & Pay"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
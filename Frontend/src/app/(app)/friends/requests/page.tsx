'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/shared/lib/api';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import { Button } from '@/shared/_components/atoms/Button';

interface FriendRequest {
  id: string;
  senderId: string;
  senderEmail: string;
  recipientId: string;
  recipientEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export default function FriendRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Mark the function as stable with useCallback, or inline it in the effect
  // The cleanest fix is to inline the fetch logic inside the effect
  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await api.get<FriendRequest[]>('/friends/requests/pending');
        if (isMounted) {
          setRequests(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Failed to load friend requests.');
          setRequests([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const data = await api.get<FriendRequest[]>('/friends/requests/pending');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load friend requests.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    setProcessing(requestId);
    try {
      await api.patch(`/friends/requests/${requestId}`, { action });
      toast.success(`Friend request ${action.toLowerCase()}ed successfully.`);
      await refreshRequests();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.getUserMessage());
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setProcessing(null);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading friend requests...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Friend Requests</h1>
        <Button variant="ghost" size="sm" onClick={goBack}>
          ← Back
        </Button>
      </div>

      {requests.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          No pending friend requests.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {requests.map((req) => (
            <li
              key={req.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                marginBottom: '0.5rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)',
              }}
            >
              <span style={{ fontWeight: '500' }}>{req.senderEmail}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAction(req.id, 'ACCEPT')}
                  disabled={processing === req.id}
                  loading={processing === req.id}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleAction(req.id, 'REJECT')}
                  disabled={processing === req.id}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
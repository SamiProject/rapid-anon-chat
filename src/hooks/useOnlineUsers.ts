import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionId } from './useSessionId';

export function useOnlineUsers() {
  const sessionId = useSessionId();
  const [onlineCount, setOnlineCount] = useState(0);

  const updateOnlineStatus = useCallback(async () => {
    if (!sessionId) return;

    // Update last_seen timestamp
    await supabase
      .from('online_users')
      .update({ last_seen: new Date().toISOString() })
      .eq('session_id', sessionId);
  }, [sessionId]);

  const registerUser = useCallback(async (
    name: string, 
    location: string, 
    gender: 'male' | 'female' | 'other',
    lookingFor: 'male' | 'female' | 'everyone'
  ) => {
    if (!sessionId) return;

    await supabase
      .from('online_users')
      .upsert({
        session_id: sessionId,
        name,
        location,
        gender,
        looking_for: lookingFor,
        last_seen: new Date().toISOString()
      });
  }, [sessionId]);

  const unregisterUser = useCallback(async () => {
    if (!sessionId) return;
    await supabase
      .from('online_users')
      .delete()
      .eq('session_id', sessionId);
  }, [sessionId]);

  const fetchOnlineCount = useCallback(async () => {
    // Count users seen in the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    
    const { count } = await supabase
      .from('online_users')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', twoMinutesAgo);

    setOnlineCount(count || 0);
  }, []);

  useEffect(() => {
    fetchOnlineCount();

    // Update count every 10 seconds
    const interval = setInterval(fetchOnlineCount, 10000);

    // Subscribe to realtime changes
    const channel = supabase
      .channel('online_users_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'online_users'
        },
        () => {
          fetchOnlineCount();
        }
      )
      .subscribe();

    // Heartbeat to keep user online
    const heartbeat = setInterval(updateOnlineStatus, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(heartbeat);
      supabase.removeChannel(channel);
    };
  }, [fetchOnlineCount, updateOnlineStatus]);

  // Cleanup on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (sessionId) {
        navigator.sendBeacon?.(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/online_users?session_id=eq.${sessionId}`,
          ''
        );
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionId]);

  return {
    onlineCount,
    registerUser,
    unregisterUser,
    refreshCount: fetchOnlineCount
  };
}

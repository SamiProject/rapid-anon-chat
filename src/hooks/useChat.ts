import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionId } from './useSessionId';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type ChatStatus = 'idle' | 'profile' | 'matching' | 'connected' | 'disconnected';

export interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: Date;
}

export interface PartnerInfo {
  name: string;
  location: string;
  gender: string;
}

export interface UserProfile {
  name: string;
  location: string;
  gender: 'male' | 'female' | 'other';
  lookingFor: 'male' | 'female' | 'everyone';
}

export function useChat() {
  const sessionId = useSessionId();
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [partnerSession, setPartnerSession] = useState<string | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [partnerLeft, setPartnerLeft] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const matchingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = useCallback(async () => {
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (matchingIntervalRef.current) {
      clearInterval(matchingIntervalRef.current);
      matchingIntervalRef.current = null;
    }
  }, []);

  // Leave queue
  const leaveQueue = useCallback(async () => {
    if (!sessionId) return;
    await supabase.from('waiting_queue').delete().eq('session_id', sessionId);
  }, [sessionId]);

  // End room
  const endRoom = useCallback(async () => {
    if (!roomId) return;
    await supabase
      .from('chat_rooms')
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq('id', roomId);
  }, [roomId]);

  // Start the chat flow - show profile form
  const initiateChat = useCallback(() => {
    setStatus('profile');
    setPartnerLeft(false);
    setPartnerInfo(null);
  }, []);

  // Start matching after profile is submitted
  const startMatching = useCallback(async (profile: UserProfile) => {
    if (!sessionId) return;
    
    setUserProfile(profile);
    setStatus('matching');
    setMessages([]);
    setRoomId(null);
    setPartnerSession(null);
    setPartnerInfo(null);
    setPartnerLeft(false);

    // Add to queue with profile info
    await supabase.from('waiting_queue').upsert({ 
      session_id: sessionId,
      name: profile.name,
      location: profile.location,
      gender: profile.gender,
      looking_for: profile.lookingFor,
      created_at: new Date().toISOString()
    });

    // Function to check if user matches preferences
    const isMatch = (userLookingFor: string, otherGender: string, otherLookingFor: string, myGender: string) => {
      const iLikeThemGender = userLookingFor === 'everyone' || userLookingFor === otherGender;
      const theyLikeMeGender = otherLookingFor === 'everyone' || otherLookingFor === myGender;
      return iLikeThemGender && theyLikeMeGender;
    };

    // Try to find a match
    const tryMatch = async () => {
      // Get waiting users that match our preferences
      const { data: waitingUsers } = await supabase
        .from('waiting_queue')
        .select('*')
        .neq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (waitingUsers && waitingUsers.length > 0) {
        // Find a compatible match
        const match = waitingUsers.find(user => 
          isMatch(profile.lookingFor, user.gender || 'other', user.looking_for || 'everyone', profile.gender)
        );

        if (match) {
          // Create chat room
          const { data: room, error } = await supabase
            .from('chat_rooms')
            .insert({
              user1_session: sessionId,
              user2_session: match.session_id,
              is_active: true
            })
            .select()
            .single();

          if (room && !error) {
            // Remove both from queue
            await supabase.from('waiting_queue').delete().in('session_id', [sessionId, match.session_id]);
            
            if (matchingIntervalRef.current) {
              clearInterval(matchingIntervalRef.current);
              matchingIntervalRef.current = null;
            }
            
            setRoomId(room.id);
            setPartnerSession(match.session_id);
            setPartnerInfo({
              name: match.name || 'Stranger',
              location: match.location || 'Unknown',
              gender: match.gender || 'other'
            });
            setStatus('connected');
            return true;
          }
        }
      }
      return false;
    };

    // Check immediately
    const matched = await tryMatch();
    
    if (!matched) {
      // Poll for matches
      matchingIntervalRef.current = setInterval(async () => {
        // Check if someone matched with us
        const { data: rooms } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('is_active', true)
          .or(`user1_session.eq.${sessionId},user2_session.eq.${sessionId}`)
          .limit(1);

        if (rooms && rooms.length > 0) {
          const room = rooms[0];
          const partnerSessionId = room.user1_session === sessionId ? room.user2_session : room.user1_session;
          
          // Get partner info from online_users or waiting_queue
          const { data: partnerData } = await supabase
            .from('online_users')
            .select('name, location, gender')
            .eq('session_id', partnerSessionId)
            .maybeSingle();

          await supabase.from('waiting_queue').delete().eq('session_id', sessionId);
          
          if (matchingIntervalRef.current) {
            clearInterval(matchingIntervalRef.current);
            matchingIntervalRef.current = null;
          }
          
          setRoomId(room.id);
          setPartnerSession(partnerSessionId);
          setPartnerInfo({
            name: partnerData?.name || 'Stranger',
            location: partnerData?.location || 'Unknown',
            gender: partnerData?.gender || 'other'
          });
          setStatus('connected');
        } else {
          // Try to match with someone
          await tryMatch();
        }
      }, 2000);
    }
  }, [sessionId]);

  // Subscribe to room events
  useEffect(() => {
    if (!roomId || !sessionId) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data.map(m => ({
          id: m.id,
          content: m.content,
          isOwn: m.sender_session === sessionId,
          timestamp: new Date(m.created_at)
        })));
      }
    };

    loadMessages();

    // Subscribe to new messages and room updates
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const msg = payload.new as any;
          if (msg.sender_session !== sessionId) {
            setMessages(prev => [...prev, {
              id: msg.id,
              content: msg.content,
              isOwn: false,
              timestamp: new Date(msg.created_at)
            }]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          const room = payload.new as any;
          if (!room.is_active) {
            setPartnerLeft(true);
            setStatus('disconnected');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const typing = payload.new as any;
          if (typing && typing.session_id !== sessionId) {
            setIsPartnerTyping(typing.is_typing);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, sessionId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!roomId || !sessionId || !content.trim()) return;

    const { data } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_session: sessionId,
        content: content.trim()
      })
      .select()
      .single();

    if (data) {
      setMessages(prev => [...prev, {
        id: data.id,
        content: data.content,
        isOwn: true,
        timestamp: new Date(data.created_at)
      }]);
    }

    // Clear typing status
    await supabase
      .from('typing_status')
      .upsert({
        room_id: roomId,
        session_id: sessionId,
        is_typing: false,
        updated_at: new Date().toISOString()
      });
  }, [roomId, sessionId]);

  // Update typing status
  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!roomId || !sessionId) return;

    await supabase
      .from('typing_status')
      .upsert({
        room_id: roomId,
        session_id: sessionId,
        is_typing: isTyping,
        updated_at: new Date().toISOString()
      });
  }, [roomId, sessionId]);

  // Disconnect
  const disconnect = useCallback(async () => {
    await cleanup();
    await leaveQueue();
    await endRoom();
    setStatus('disconnected');
    setRoomId(null);
    setPartnerSession(null);
  }, [cleanup, leaveQueue, endRoom]);

  // Find new partner - always show profile form again for fresh chat
  const findNew = useCallback(async () => {
    await cleanup();
    await endRoom();
    setMessages([]);
    setPartnerLeft(false);
    setPartnerInfo(null);
    setUserProfile(null);
    setStatus('profile');
  }, [cleanup, endRoom]);

  // Report user
  const reportUser = useCallback(async (reason?: string) => {
    if (!roomId || !partnerSession || !sessionId) return;

    await supabase.from('reports').insert({
      room_id: roomId,
      reporter_session: sessionId,
      reported_session: partnerSession,
      reason
    });

    await disconnect();
  }, [roomId, partnerSession, sessionId, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      leaveQueue();
    };
  }, [cleanup, leaveQueue]);

  return {
    status,
    messages,
    isPartnerTyping,
    partnerInfo,
    partnerLeft,
    userProfile,
    initiateChat,
    startMatching,
    sendMessage,
    setTyping,
    disconnect,
    findNew,
    reportUser
  };
}

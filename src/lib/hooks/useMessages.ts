import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { useAuth } from '../../contexts/AuthContext';

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            full_name,
            avatar_url
          ),
          receiver:users!messages_receiver_id_fkey (
            full_name,
            avatar_url
          )
        `);

      if (conversationId) {
        // If conversationId is provided, fetch messages for that specific conversation
        query = query.eq('conversation_id', conversationId);
      } else {
        // Otherwise, fetch messages where the user is either sender or receiver
        query = query.or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      addToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription for messages
    const subscription = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: conversationId 
            ? `conversation_id=eq.${conversationId}`
            : `or(sender_id.eq.${user?.id},receiver_id.eq.${user?.id})`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, conversationId]);

  const sendMessage = async (content: string, receiverId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: receiverId,
          content,
          conversation_id: conversationId
        });

      if (error) throw error;

      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      addToast('Failed to send message', 'error');
      return false;
    }
  };

  const refresh = () => {
    fetchMessages();
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh
  };
}

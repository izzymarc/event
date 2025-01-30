import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  file_url?: string;
  file_name?: string;
  read_at?: string;
  created_at: string;
}

export function useMessaging(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const channel = supabase.channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const typingUsers = Object.values(state).reduce((acc, presence: any) => {
          presence.forEach((p: any) => {
            if (p.typing) {
              acc[p.user_id] = true;
            }
          });
          return acc;
        }, {} as Record<string, boolean>);
        setTyping(typingUsers);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  const fetchMessages = useCallback(async (otherUserId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const sendMessage = useCallback(async (receiverId: string, content: string, file?: File) => {
    try {
      let fileUrl, fileName;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase
          .storage
          .from('message-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase
          .storage
          .from('message-attachments')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = file.name;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: userId,
          receiver_id: receiverId,
          content,
          file_url: fileUrl,
          file_name: fileName
        }])
        .select()
        .single();

      if (error) throw error;
      setMessages(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [userId]);

  const markAsRead = useCallback(async (messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .eq('receiver_id', userId);

      if (error) throw error;
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.id) ? { ...msg, read_at: new Date().toISOString() } : msg
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }, [userId]);

  const setUserTyping = useCallback(async (receiverId: string, isTyping: boolean) => {
    try {
      await supabase.channel('messages').track({
        user_id: userId,
        typing: isTyping,
        receiver_id: receiverId
      });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [userId]);

  return {
    messages,
    loading,
    typing,
    fetchMessages,
    sendMessage,
    markAsRead,
    setUserTyping
  };
}

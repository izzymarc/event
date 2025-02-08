// supabase_functions/messages.js
import { supabase } from '../lib/supabase';
import { handleApiError } from './utils';

// Send a message
export async function sendMessage(req, res) {
  try {
    const messageData = req.body; // Assuming message data is in the request body
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data); // 201 Created
  } catch (error) {
    handleApiError(error, res);
  }
}

// List messages between two users
export async function listMessages(req, res) {
  try {
    const { senderId, receiverId } = req.query; // Assuming sender and receiver IDs are in the query parameters

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Mark a message as read
export async function markMessageAsRead(req, res) {
  try {
    const messageId = req.params.id; // Assuming message ID is in the URL params

    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

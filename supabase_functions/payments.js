// supabase_functions/payments.js
import { supabase } from '../lib/supabase';
import { handleApiError } from './utils';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Create a payment intent
export async function createPaymentIntent(req, res) {
  try {
    const { amount, proposalId } = req.body; // Assuming amount and proposalId are in the request body

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd', // Or your preferred currency
      metadata: { proposal_id: proposalId }, // Store proposal ID in metadata
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    handleApiError(error, res);
  }
}

// Capture payment and update payment status
export async function capturePayment(req, res) {
  try {
    const { paymentIntentId } = req.body; // Assuming paymentIntentId is in the request body

    // Capture the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    // Update payment status in Supabase
    const { data, error } = await supabase
      .from('payments')
      .update({ status: paymentIntent.status }) // Use Stripe's payment status
      .eq('proposal_id', paymentIntent.metadata.proposal_id) // Match by proposal ID
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Add more payment-related API endpoints as needed (e.g., refund payment, list transactions)

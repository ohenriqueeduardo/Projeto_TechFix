import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia' as NonNullable<ConstructorParameters<typeof Stripe>[1]>['apiVersion'],
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { price, serviceId } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({ error: 'Preço inválido' });
    }

    // Amount should be in cents
    const amountInCents = Math.round(Number(price) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'brl',
      metadata: {
        serviceId: serviceId || 'N/A'
      },
      // You could add automatic_payment_methods: { enabled: true } if you want
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    const message = error instanceof Error ? error.message : 'Falha ao processar intenção de pagamento';
    res.status(500).json({ error: message });
  }
};

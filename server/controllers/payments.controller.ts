import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

if (accessToken) {
  console.log(`[Mercado Pago] Access Token loaded. Prefix: ${accessToken.substring(0, 12)}... (Length: ${accessToken.length})`);
} else {
  console.warn('[Mercado Pago] MERCADO_PAGO_ACCESS_TOKEN environment variable is missing! Using sandbox fallback.');
}

const mpClient = new MercadoPagoConfig({
  accessToken: accessToken || 'TEST-8418049818816812-061111-c88f28f804981681a28a3f89a8126b1a-12345678', // Default fallback for dev environment check
});

export const createPreference = async (req: Request, res: Response) => {
  try {
    const { price, serviceTitle, orderId, serviceId } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({ error: 'Preço inválido' });
    }

    if (!orderId) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório' });
    }

    if (!serviceId) {
      return res.status(400).json({ error: 'ID do serviço é obrigatório' });
    }

    const preference = new Preference(mpClient);

    // Resolve current origin dynamically
    let origin = 'http://localhost:8081';
    if (req.headers.referer) {
      try {
        origin = new URL(req.headers.referer).origin;
      } catch (e) {
        // Fallback if referer is invalid
      }
    } else if (req.headers.host) {
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      origin = `${protocol}://${req.headers.host}`;
    }

    const successUrl = `${origin}/cliente/checkout/${serviceId}/confirmado?payment_intent=success&orderId=${orderId}`;
    const failureUrl = `${origin}/cliente/checkout/${serviceId}/confirmado?payment_intent=failure&orderId=${orderId}`;
    const pendingUrl = `${origin}/cliente/checkout/${serviceId}/confirmado?payment_intent=pending&orderId=${orderId}`;

    const body = {
      items: [
        {
          id: orderId,
          title: serviceTitle || 'Serviço TechFix',
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'BRL',
        }
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: 'approved',
      external_reference: orderId,
      metadata: {
        order_id: orderId
      }
    };

    const response = await preference.create({ body });

    res.json({
      id: response.id,
      initPoint: response.init_point,
    });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    const message = error instanceof Error ? error.message : 'Falha ao processar intenção de pagamento';
    res.status(500).json({ error: message });
  }
};

export const processTransparentPayment = async (req: Request, res: Response) => {
  try {
    const { 
      transaction_amount, 
      payment_method_id, 
      token, 
      installments, 
      payer, 
      description,
      order_id
    } = req.body;

    if (!transaction_amount || !payment_method_id || !payer?.email) {
      return res.status(400).json({ error: 'Faltam dados obrigatórios para processar o pagamento' });
    }

    const payment = new Payment(mpClient);

    const body: Record<string, unknown> = {
      transaction_amount: Number(transaction_amount),
      description: description || 'Serviço TechFix',
      payment_method_id,
      payer: {
        email: payer.email,
        first_name: payer.first_name || 'Cliente',
      },
      external_reference: order_id
    };

    if (payment_method_id === 'pix') {
      // PIX requires no token, but does not support installments
      // It returns the QR Code and copy-paste string
    } else {
      // Credit or Debit Card
      if (!token) return res.status(400).json({ error: 'Token do cartão não fornecido' });
      body.token = token;
      body.installments = installments || 1;
    }

    const response = await payment.create({ body });

    if (payment_method_id === 'pix') {
      return res.json({
        id: response.id,
        status: response.status,
        qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      });
    } else {
      return res.json({
        id: response.id,
        status: response.status,
        status_detail: response.status_detail
      });
    }

  } catch (error: unknown) {
    const err = error as Error & { cause?: unknown };
    console.error('Error processing transparent payment:', err);
    const message = err.message || 'Falha ao processar pagamento transparente';
    res.status(500).json({ error: message, details: err.cause });
  }
};

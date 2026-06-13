import { MercadoPagoConfig, PaymentMethod } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'TEST-4714972698787037-061309-4bdf57c87c7a6b1886c196c3b104cf6d-1730247701' });
const paymentMethods = new PaymentMethod(client);

paymentMethods.get().then((result) => {
  const methods = result.map(r => ({
    id: r.id,
    name: r.name,
    payment_type_id: r.payment_type_id,
    status: r.status
  }));
  console.log(JSON.stringify(methods, null, 2));
}).catch((error) => console.log(error));

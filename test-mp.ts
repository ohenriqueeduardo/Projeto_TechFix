import { MercadoPagoConfig, PaymentMethod } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-4714972698787037-061309-ce60a56d73f55aff5375981823d0b434-1730247701' });
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

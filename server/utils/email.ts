import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user or real email
    pass: process.env.SMTP_PASS, // generated ethereal password or app password
  },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"TechFix" <${process.env.SMTP_USER || 'no-reply@techfix.com'}>`,
      to,
      subject: 'Bem-vindo à TechFix! 🎉',
      text: `Olá, ${name}!\n\nBem-vindo à TechFix. Estamos muito felizes em tê-lo conosco.\n\nSua conta foi criada com sucesso.\n\nAtenciosamente,\nEquipe TechFix`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">Olá, ${name}!</h2>
          <p>Bem-vindo à <strong>TechFix</strong>. Estamos muito felizes em tê-lo conosco.</p>
          <p>Sua conta foi criada com sucesso. Agora você pode explorar todos os nossos serviços.</p>
          <br />
          <p>Atenciosamente,</p>
          <p><strong>Equipe TechFix</strong></p>
        </div>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

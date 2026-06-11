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

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"TechFix" <${process.env.SMTP_USER || 'no-reply@techfix.com'}>`,
      to,
      subject: 'Seu Código de Verificação TechFix - 🔑',
      text: `Seu código de verificação é: ${code}\n\nEste código expira em 10 minutos.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #06b6d4; text-align: center; font-weight: bold; margin-bottom: 20px;">Código de Verificação</h2>
          <p>Olá!</p>
          <p>Use o código de verificação de 6 dígitos abaixo para concluir o seu cadastro na <strong>TechFix</strong>:</p>
          <div style="background-color: #f4f4f5; padding: 15px; text-align: center; font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #06b6d4; border-radius: 8px; margin: 24px 0; border: 1px solid #e4e4e7;">
            ${code}
          </div>
          <p style="font-size: 11px; color: #71717a; text-align: center; line-height: 1.5;">Este código é de uso único e válido por 10 minutos. Se você não solicitou este código, por favor desconsidere este e-mail.</p>
          <br />
          <p>Atenciosamente,</p>
          <p><strong>Equipe TechFix</strong></p>
        </div>
      `,
    });

    console.log('Verification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

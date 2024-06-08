import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';

export default async function handler(req, res) {
  const body = await req.body;

  const name = body.name;
  const email = body.email;
  const phone = body.phone;
  const message = body.message;

  const templateParams = {
    name: name,
    email: email,
    phone: phone,
    message: message,
  };

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      console.log('EMAILJS FAILED...', err);
      return;
    }
    console.log('ERROR', err);
  }
  res.status(200).json({ text: 'Form submitted' });
}

import * as imaps from 'imap-simple';
import * as MailComposer from 'nodemailer/lib/mail-composer';

export async function saveToSentFolder(mailOptions: any) {
  const mail = new MailComposer(mailOptions);
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_IMAP_HOST;
  const port = Number(process.env.EMAIL_IMAP_PORT);
  const tls = true;

  const rawMessage: Buffer = await new Promise((resolve, reject) => {
    mail.compile().build((err, message) => {
      if (err) return reject(err);
      resolve(message);
    });
  });

  const connection = await imaps.connect({
    imap: {
      user,
      password,
      host,
      port,
      tls,
      authTimeout: 10000,
      tlsOptions: { rejectUnauthorized: false },
    },
  });

  await connection.openBox('Sent');
  await connection.append(rawMessage, {
    mailbox: 'Sent',
    flags: ['Seen'],
  });
  await connection.end();
}

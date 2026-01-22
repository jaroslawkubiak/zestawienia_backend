import * as imaps from 'imap-simple';
import * as MailComposer from 'nodemailer/lib/mail-composer';

interface IMAPConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export async function saveToSentFolder(
  imapConfig: IMAPConfig,
  mailOptions: any,
) {
  const mail = new MailComposer(mailOptions);
  const rawMessage: Buffer = await new Promise((resolve, reject) => {
    mail.compile().build((err, message) => {
      if (err) return reject(err);
      resolve(message);
    });
  });
  const { user, password, port, host, tls } = { ...imapConfig };

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

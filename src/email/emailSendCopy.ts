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

  const connection = await imaps.connect({
    imap: {
      user: imapConfig.user,
      password: imapConfig.password,
      host: imapConfig.host,
      port: imapConfig.port,
      tls: imapConfig.tls,
      authTimeout: 10000,
    },
  });

  await connection.openBox('Sent');
  await connection.append(rawMessage, {
    mailbox: 'Sent',
    flags: ['Seen'],
  });
  await connection.end();
}

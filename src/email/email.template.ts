import { ICommentList } from './types/ICommentList';
import { IHTMLTemplateOptions } from './types/IHTMLTemplateOptions';

const ASSETS_URL = 'https://zestawienia.zurawickidesign.pl/assets/images';
const currentYear = new Date().getFullYear();
const socialColor = 'accent'; // black or accent

export function createHTML(options: IHTMLTemplateOptions): string {
  const {
    GDPRClause,
    link,
    header,
    newCommentsList,
    needsAttentionCommentsList,
  } = { ...options };

  const needsAttentionHtml = renderNeedsAttentionSection(
    needsAttentionCommentsList,
  );

  return `
    ${HTMLheader()}
    <!-- TITLE -->
    <tr>
      <td style="padding:40px 0 20px 0; text-align:center;">
        <h2 style="margin:0; font-size:24px; font-weight:bold; color:#3bbfa1;">Nowe komentarze</h2>
      </td>
    </tr>    

    <!-- NEW COMMENTS -->
    <tr>
      <td style="padding: 10px 0;" colspan="2">
        <p style="margin:0 0 10px 0; padding:0;">${header}</p>
        <p style="margin:0 0 10px 0; padding:0; font-weight:bold;">Nieprzeczytane komentarze:</p>
        ${createCommentsTable(newCommentsList)}
      </td>
    </tr>

    ${needsAttentionHtml}

    <!-- link do zestawienia -->
    <tr>
      <td style="padding:20px 0;" colspan="2">
        <a href="${link}" target="_blank"
          style="color:#3bbfa1; font-size:24px; font-weight:bold; text-decoration:none;">Link do zestawienia</a>
      </td>    
    </tr>

    <!-- FOOTER MESSAGE + SOCIALS -->
    ${HTMLfooter(GDPRClause)}
    </table>
  </body>
</html>
`;
}

function HTMLheader() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email</title>
    </head>

    <body style="margin:0; padding:20px; background:#fafafa; font-family:Arial, sans-serif; font-size:16px; color:#0a0a0a;">

      <table align="center" width="800px" border="0" style="margin:20px auto; max-width:800px; border-collapse: collapse;">

        <!-- LOGO -->
        <tr>
          <td style="width:300px; padding:30px 0 30px 0; text-align:left;">
            <a href="https://zurawickidesign.pl/" target="_blank">
              <img src="${ASSETS_URL}/logo-black.png" 
              alt="logo" 
              style="cursor: pointer; width:300px; display:block;" />
            </a>
          </td>
        </tr>
`;
}

function HTMLfooter(GDPRClause: string): string {
  return `
<!-- FOOTER MESSAGE + SOCIALS -->
<tr>
  <td>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:10px 0;">
      <tr>
        <td valign="top">
          <p style="margin:0 0 10px 0; padding:0;">Pozdrawiamy,</p>
          <p style="margin:0 0 10px 0; padding:0;">Zespół Żurawicki Design</p>
          <p style="margin:0 0 20px 0; padding:0;">Jakub Żurawicki, Joanna Kubiak</p>
          <p style="margin:0 0 10px 0; padding:0;">ul. Czerkaska 10/7, 85-641 Bydgoszcz</p>
          <p style="margin:0 0 20px 0; padding:0;">E-mail: kontakt@zurawickidesign.pl</p>
        </td>
      </tr>
    </table>
    <table border="0" style="display:inline-block;">
      <tr>
        <!-- IG -->
        <td>
          <a href="https://www.instagram.com/zurawicki.design/" target="_blank">
            <img 
            alt="Instagram" 
            title="Instagram" 
            src="${ASSETS_URL}/social-${socialColor}/ig.png"
            width="32"
            height="32"
            style="cursor: pointer;"
            >
          </a>
        </td>
        <!-- FB -->
        <td style="padding-left:20px;">
          <a href="https://www.facebook.com/zurawicki.design/?locale=pl_PL" target="_blank">
            <img 
            alt="Facebook" 
            title="Facebook" 
            src="${ASSETS_URL}/social-${socialColor}/fb.png"
            width="32"
            height="32"
            style="cursor: pointer;"
            >
          </a>
        </td>
        <!-- WWW -->
        <td style="padding-left:20px;">
          <a href="https://zurawickidesign.pl/" target="_blank">
            <img
            alt="Website"
            title="Website"
            src="${ASSETS_URL}/social-${socialColor}/www.png"
            width="32"
            height="32"
            style="cursor: pointer;"
            />
          </a>
        </td>
      </tr>
    </table>          
  </td>
</tr>
<!-- COPYRIGHT -->
<tr>
  <td style="padding:20px 0; text-align:center;">
    <p style="font-size:14px;">&copy; ${currentYear} Żurawicki Design</p>
  </td>
</tr>
</tr>
<!-- GDPRClause -->
<tr>
  <td style="padding:10px 0; text-align:justify;">
    <p style="font-size:10px; margin:0; padding:0; font-size:10px;">${GDPRClause}</p>
  </td>
</tr>
`;
}

function createCommentsTable(commentsList: ICommentList[]): string {
  let commentsTable = `
      <table align="center" border="1" style="width:100%; border-collapse:collapse; border:1px solid black;">
      <tr style="background:#3bbfa1; color:#fff;">
        <td style="width:30%; padding:8px;">Produkt</td>
        <td style="width:30%; padding:8px;">Komentarz</td>
        <td style="width:15%; padding:8px; text-align:center;">Data</td></tr>`;

  commentsList.forEach((comment) => {
    let row = `<tr><td style="padding:8px;">${comment.product}</td>`;
    row += `<td style="padding:8px;">${comment.comment}</td>`;
    row += `<td style="padding:8px; text-align:center;">${comment.createdAt}</td></tr>`;

    commentsTable += row;
  });

  commentsTable += '</table>';
  return commentsTable;
}

function getVerbComments(count: number): string {
  if (count === 1) return 'komentarz oznaczony jako ważny';
  if (count >= 2 && count <= 4) return 'komentarze oznaczone jako ważne';
  return 'komentarzy oznaczonych jako ważne';
}

function renderNeedsAttentionSection(comments: ICommentList[]): string {
  if (!comments.length) return '';

  const verbComments = getVerbComments(comments.length);

  return `
    <!-- NEEDS ATTENTION COMMENTS -->
    <tr>
      <td style="padding: 30px 0" colspan="2">
        <p style="margin:0 0 10px 0; padding:0; font-weight:bold;">
          Masz także ${comments.length} ${verbComments}:
        </p>
        ${createCommentsTable(comments)}
      </td>
    </tr>
  `;
}

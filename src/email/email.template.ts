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

  const NEEDS_ATTENTION_COMMENTS =
    needsAttentionCommentsList.length !== 0
      ? `
        <!-- NEEDS ATTENTION COMMENTS -->
        <tr>
          <td style="padding: 30px 0" colspan="2">
            <p style="font-weight: bold">Komentarze oznaczone jako ważne:</p>
            ${createCommentsTable(needsAttentionCommentsList)}
          </td>
        </tr>`
      : '';

  return `
    ${HTMLheader()}
    <!-- TITLE -->
    <tr>
      <td style="padding: 40px 0 20px 0; text-align:center;">
        <h2 style="margin:0; font-size:24px; font-weight:bold; color: #3bbfa1;">Nowe komentarze</h2>
      </td>
    </tr>

    <!-- NEW COMMENTS -->
    <tr>
      <td style="padding: 10px 0;" colspan="2">
        <p>${header}</p>
        <p style="font-weight: bold">Nieprzeczytane komentarze:</p>
        ${createCommentsTable(newCommentsList)}
      </td>
    </tr>

    ${NEEDS_ATTENTION_COMMENTS}

    <!-- link do zestawienia -->
    <tr>
      <td style="padding: 20px 0" colspan="2">
        <a href="${link}" target="_blank" 
        style="color: #3bbfa1; font-size: 24px; font-weight: bold; text-decoration: none">Link do zestawienia</a>
        </p>
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

  <table align="center" width="800px" cellspacing="0" cellpadding="0" border="0" style="margin:20px auto; max-width:800px;">

    <!-- LOGO -->
    <tr style="margin: 30px 0; width: 800px; text-align: left">
      <td style="width: 300px">
        <img
          src="${ASSETS_URL}/logo-black.png"
          alt="logo"
          style="width: 300px"
        />
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
          <p style="margin:0 0 10px 0;">Pozdrawiamy,</p>
          <p style="margin:0 0 10px 0;">Zespół Żurawicki Design</p>
          <p style="margin:0 0 20px 0;">Jakub Żurawicki, Joanna Kubiak</p>
          <p style="margin:0 0 10px 0;">ul. Czerkaska 10/7, 85-641 Bydgoszcz</p>
          <p style="margin:0 0 20px 0;">E-mail: kontakt@zurawickidesign.pl</p>
        </td>
      </tr>
    </table>
    <table cellspacing="0" cellpadding="0" border="0" style="display:inline-block;">
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
            height="32">
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
  <td style="padding:10px 0; text-align:left;">
    <p style="font-size:10px;">${GDPRClause}</p>
  </td>
</tr>
`;
}

function createCommentsTable(commentsList: ICommentList[]): string {
  let commentsTable = `
      <table align="center" border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; border: 1px solid black;">
      <tr style="background: #3bbfa1; color: #fff"><td style="width: 30%">Produkt</td>
      <td style="width: 55%">Komentarz</td>
      <td style="width: 15%">Data</td></tr>`;

  commentsList.forEach((comment) => {
    let row = `<tr><td>${comment.product}</td>`;
    row += `<td>${comment.comment}</td>`;
    row += `<td style="text-align: center;">${comment.createdAt}</td></tr>`;

    commentsTable += row;
  });

  commentsTable += '</table>';
  return commentsTable;
}

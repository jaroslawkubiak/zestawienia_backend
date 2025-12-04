import { ICommentList } from './types/ICommentList';

export function createHTML(
  header: string,
  content: string,
  link: string,
): string {
  return `
      ${HTMLheader}
      <!-- TITLE -->
      <tr>
        <td style="padding:10px 0; text-align:center;">
          <h2 style="margin:0; font-size:24px; font-weight:bold; color: #3bbfa1;">Nowe komentarze</h2>
        </td>
      </tr>

      <!-- MESSAGE -->
      <tr>
        <td style="padding: 20px" colspan="2">
          <p>${header}</p>
          <p style="font-weight: bold">Nieprzeczytane komentarze: </p>
          ${content}
        </td>
      </tr>

      ${link}

    <!-- FOOTER MESSAGE + SOCIALS -->
    ${HTMLfooter}
    
    </table>
  </body>
</html>
`;
}

const HTMLfooter = `
<tr>
  <td style="padding:20px;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <!-- LEFT SIDE -->
        <td valign="top" style="width:50%; padding-right:10px; font-weight: bold;">
          <p style="margin:0 0 8px 0;">Pozdrawiamy,</p>
          <p style="margin:0 0 8px 0;">Zespół Żurawicki Design</p>
          <p style="margin:0 0 8px 0;">Jakub Żurawicki & Joanna Kubiak</p>
        </td>
        <!-- RIGHT SIDE (SOCIAL ICONS) -->
        <td valign="bottom" style="width:50%; text-align:right;">

          <table cellspacing="0" cellpadding="0" border="0" style="display:inline-block;">
            <tr>

              <!-- IG -->
              <td style="padding-left:20px;">
                <a href="https://www.instagram.com/zurawicki.design/" target="_blank">
                  <img 
                  alt="Instagram" 
                  title="Instagram" 
                  src="https://zestawienia.zurawickidesign.pl/assets/images/social-accent/ig.png"
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
                  src="https://zestawienia.zurawickidesign.pl/assets/images/social-accent/fb.png"
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
                  src="https://zestawienia.zurawickidesign.pl/assets/images/social-accent/www.png"
                  width="32"
                  height="32"
                />
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- COPYRIGHT -->
<tr>
  <td style="padding:30px 0; text-align:center;">
    <p style="margin:0; font-size:14px;">&copy; 2025 Żurawicki Design</p>
  </td>
</tr>

`;

const HTMLheader = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email</title>
</head>

<body style="margin:0; padding:20px; background:#fafafa; font-family:Arial, sans-serif; font-size:16px; color:#0a0a0a;">

  <table align="center" width="800px" cellspacing="0" cellpadding="0" border="0" style="margin:20px auto; max-width:700px;">

    <!-- LOGO -->
    <tr style="margin: 30px 0; width: 700px; text-align: right">
      <td style="width: 300px">
        <img
          src="https://zestawienia.zurawickidesign.pl/assets/images/logo-black.png"
          alt="logo"
          style="width: 300px"
        />
      </td>
    </tr>
`;

export function createCommentsTable(commentsList: ICommentList[]): string {
  let commentsTable = `
          <table align="center" border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; border: 1px solid black;">
          <tr style="background: #3bbfa1; color: #fff"><td style="width: 30%">Produkt</td>
          <td style="width: 55%">Komentarz</td>
          <td style="width: 15%">Data</td></tr>`;

  commentsList.forEach((comment) => {
    let row = `<tr><td>${comment.product}</td>`;
    row += `<td>${comment.comment}</td>`;
    row += `<td>${comment.createdAt}</td></tr>`;

    commentsTable += row;
  });

  commentsTable += '</table>';
  return commentsTable;
}

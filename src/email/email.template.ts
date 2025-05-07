export function createHTMLHeader(title: string, commentsList: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inwestycja</title>
  </head>
  <body
    style="
      background-color: rgb(250, 250, 250);
      color: rgb(10, 10, 10);;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
      font-size: 20px;
      padding: 20px;
    "
  >
    <table align="center" style="width: 700px; margin: 0 auto">
      <tr style="margin: 30px 0; width: 700px; text-align: right">
        <td style="width: 300px">
          <img
            src="https://zestawienia.zurawickidesign.pl/assets/images/logo-black.png"
            alt="logo"
            style="width: 300px"
          />
        </td>
      </tr>
      <tr>
        <td style="padding: 30px 0; text-align: center" colspan="2">
          <h2 style="margin: 0">Nowe komentarze</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px" colspan="2">
          <p>${title}</p>
          <p>Nowe komentarze: </p>
          ${commentsList}
        </td>
      </tr>
      <tr>
        <td style="padding: 0px 20px" colspan="2">
          <p>
            Pozdrawiamy. <br />
            Zespół Żurawicki Design<br />
            Jakub Żurawicki, Joanna Kubiak
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 0; text-align: center" colspan="2">
          <p style="margin: 0; font-size: 18px">&copy; 2025 Żurawicki Design</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export default  ({markup, css}) => {
    return `<!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <title>LosConquistadores</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Open+Sans:wght@300;800&family=Tillana:wght@400;500;600;700;800&display=swap" rel="stylesheet">


            <link rel="icon" href="data:,">
          </head>
        <body>
            <div id="root">${markup}</div>
            <style id="jss-server-side">${css}</style>
            <script type="text/javascript" src="/dist/bundle.js"></script>
        </body>
    </html>`
}
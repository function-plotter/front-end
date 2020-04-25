const express = require('express');
const app = express();

app.use(express.static('./dist/function-plotter'));

app.get('/*', function (req, res) {
  res.sendFile('index.html', { root: 'dist/function-plotter/' });
});

app.listen(process.env.PORT || 8080);

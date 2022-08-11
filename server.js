const express = require('express');
var app = express();
const PORT = 8070;

app.use(express.static(__dirname));

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${server.address().port}`)
});
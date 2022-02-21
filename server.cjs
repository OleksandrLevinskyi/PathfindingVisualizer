const express = require('express');
const DeviceDetector = require('node-device-detector');

const app = express();
const port = process.env.PORT || 3000;

const detector = new DeviceDetector;

app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
    const userAgent = req.get('User-Agent');
    const result = detector.detect(userAgent);

    let clientName = result.client.name;
    let deviceType = result.device.type;

    if (clientName === "Chrome" && deviceType === "desktop") {
        res.sendFile(__dirname + '/index.html');
    }

    res.sendFile(__dirname + '/info.html');
});

app.listen(port, () => console.log(`server is running http://localhost:${port}/`));
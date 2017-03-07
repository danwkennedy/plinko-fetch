const https = jest.genMockFromModule('https');
const Sender = require('./sender');

const sender = new Sender();

https.__setResponse__ = sender.setResponse.bind(sender);
https.__setError__ = sender.setError.bind(sender);
https.__getOptions__ = () => sender.options;

https.request = sender.send.bind(sender);

module.exports = https;

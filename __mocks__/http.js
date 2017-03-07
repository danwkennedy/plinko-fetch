const http = jest.genMockFromModule('http');
const Sender = require('./sender');

const sender = new Sender();

http.__setResponse__ = sender.setResponse.bind(sender);
http.__setError__ = sender.setError.bind(sender);
http.__getOptions__ = () => sender.options;

http.request = sender.send.bind(sender);

module.exports = http;

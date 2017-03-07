const { EventEmitter } = require('events');

module.exports = class Sender {

  constructor() {
    this.options = {};
    this.error = null;
    this.response = getDefaultResponse();
  }

  setResponse(response) {
    this.response = response;
  }

  setError(err) {
    this.error = err;
  }

  send(options, cb) {
    this.options = options;
    return new Response(this.response, this.error, cb);
  }
}

class Response extends EventEmitter {

  constructor(response, error, callback) {
    super();
    this.response = response;
    this.error = error;
    this.callback = callback;
  }

  pipe(body) {
    this.body = body;
  }

  end() {
    if (this.error) {
      return this.emit('error', this.error);
    }

    return this.callback(this.response);
  }

}

function getDefaultResponse() {
  return {
    pipe: () => '',
    statusCode: 200,
    statusmessage: 'OK',
    headers: {}
  }
}

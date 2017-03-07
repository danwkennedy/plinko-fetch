const defaults = require('lodash.defaults');
const http = require('http');
const https = require('https');
const { Headers, Response } = require('@plinko/core');
const { PassThrough } = require('stream');

const DEFAULT = {
  /*redirect: 'follow',
  follow: 20,*/
  timeout: 0,
  agent: null
};

module.exports = function (opts = {}) {
  // TODO: handle redirects
  const { /*redirect, follow,*/ timeout, agent } = defaults(opts, DEFAULT);


  return function (request) {
    const send = request.url.protocol === 'https:' ? https.request : http.request;

    const options = {
      protocol: request.url.protocol,
      hostname: request.url.host,
      port: request.url.port,
      path: request.url.path,
      method: request.method,
      headers: headersToObject(request.headers),
      agent: agent,
      timeout: timeout
    };

    return new Promise((resolve, reject) => {
      const req = send(options, res => {

        const body = res.pipe(new PassThrough());
        const responseOptions = {
          url: request.url,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: new Headers(res.headers),
          size: request.size,
          timeout: request.timeout
        };

        return resolve(new Response(body, responseOptions));
      });

      req.on('error', err => reject(err));

      req.pipe(request.body);
      req.end();
    });
  }
};

function headersToObject(headers) {
  const obj = {};

  for (let [name, value] of headers.entries()) {
    obj[name] = value;
  }

  return obj;
}

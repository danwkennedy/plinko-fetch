const fetch = require('.');
const { Request, Headers } = require('@plinko/core');

jest.mock('http');
jest.mock('https');

describe(`configuration`, () => {

  test(`returns a middleware function`, () => {
    const middleware = fetch();

    expect(middleware).toBeInstanceOf(Function);
  });

  test(`defaults options`, async () => {
    const fetcher = fetch();

    await fetcher(new Request('some/url'));

    const opts = require('http').__getOptions__();
    expect(opts.agent).toBeNull();
    expect(opts.timeout).toBe(0);
  });

  test(`sets timeout and agent`, async () => {
    const agent = { name: 'some agent' };
    const timeout = 20;
    const fetcher = fetch({ agent: agent, timeout: timeout });

    await fetcher(new Request('some/url'));

    const opts = require('http').__getOptions__();
    expect(opts.agent).toEqual(agent);
    expect(opts.timeout).toBe(timeout);
  });
});

describe(`middleware`, () => {

  test(`calls either http or https depending on the protocol`, async () => {
    const fetcher = fetch();

    await Promise.all([
      fetcher(new Request('http://www.httpTest.com')),
      fetcher(new Request('https://www.httpstest.com'))
    ]);

    const httpOpts = require('http').__getOptions__();
    expect(httpOpts.protocol).toBe('http:');
    expect(httpOpts.hostname).toBe('www.httptest.com');

    const httpsOpts = require('https').__getOptions__();
    expect(httpsOpts.protocol).toBe('https:');
    expect(httpsOpts.hostname).toBe('www.httpstest.com');
  });

  test(`calls with the correct url options`, async () => {
    const fetcher = fetch();

    await fetcher(new Request('http://www.httpTest.com:8080/some/path', { method: 'POST' }));

    const opts = require('http').__getOptions__();
    expect(opts).toMatchObject({
      protocol: 'http:',
      hostname: 'www.httptest.com:8080',
      port: '8080',
      path: '/some/path',
      method: 'POST'
    });
  });

  test(`converts headers to an object`, async () => {
    const fetcher = fetch();

    const headers = new Headers({ 'content-type': 'application/json' });

    await fetcher(new Request('http://www.httpTest.com', { headers: headers }));

    const opts = require('http').__getOptions__();
    expect(opts.headers).toMatchObject({
      'content-type': 'application/json'
    });
  });

  test(`passes error's through`, async () => {
    const fetcher = fetch();

    require('http').__setError__(new Error('Error sending request'));

    try {
      await fetcher(new Request('/some/url'));
      throw new Error('Should have thrown');
    } catch (err) {
      expect(err.message).toEqual('Error sending request');
    }
  });
});



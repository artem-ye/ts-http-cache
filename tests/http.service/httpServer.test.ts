import { AddressInfo } from 'node:net';
import { HttpServer } from '@services/http.service/HttpServer';
import {
  HttpServerRequest,
  HttpServerResponse,
} from '@services/http.service/HttpServer.types';
import { STATUS_CODES } from 'node:http';

const mockRouter = {
  errResp: {
    code: 404,
    text: STATUS_CODES[404],
  },
  successResp: {
    code: 200,
    text: STATUS_CODES[200],
  },
  _listener(req: HttpServerRequest, res: HttpServerResponse) {
    const { code, text } = req.url === '/' ? this.successResp : this.errResp;
    res.statusCode = code;
    res.end(text);
  },
  get listener() {
    return this._listener.bind(this);
  },
};

const host = '127.0.0.1';
const port = 5000;
const server = new HttpServer({
  host,
  port,
  listener: mockRouter.listener,
});

beforeAll(async () => server.start());
afterAll(async () => server.stop());

describe('Http server', () => {
  it('Should use correct params', async () => {
    const { port: srvPort, address } = server.instance.address() as AddressInfo;
    expect(address).toBe(host);
    expect(srvPort).toBe(port);
  });
});

describe('Http server Listener', () => {
  it('Should resolve 200', async () => {
    const resp = await fetch(`http:${host}:${port}`);
    expect(resp.status).toBe(mockRouter.successResp.code);
    expect(await resp.text()).toBe(mockRouter.successResp.text);
  });

  it('Should resolve 404', async () => {
    const errResp = await fetch(`http:${host}:${port}/foo`);
    expect(errResp.status).toBe(mockRouter.errResp.code);
    expect(await errResp.text()).toBe(mockRouter.errResp.text);
  });
});

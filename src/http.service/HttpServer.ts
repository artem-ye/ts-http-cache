import http from 'node:http';
import { AddressInfo, ListenOptions } from 'node:net';
import {
  HttpServerRequest,
  HttpServerResponse,
  IHttpServer,
  IHttpServerOptions,
} from './HttpServer.types';

const DEFAULT_OPTS: IHttpServerOptions = {
  port: 3000,
  host: '127.0.0.1',
  listener: (_: HttpServerRequest, res: HttpServerResponse) => {
    res.statusCode = 200;
    res.end('It works');
  },
  logging: false,
};

export class HttpServer implements IHttpServer {
  readonly instance: http.Server;
  private listenOpts: ListenOptions;
  private logging: boolean | undefined;

  constructor(opts: IHttpServerOptions = {}) {
    const { logging, listener, ...listenOpts }: IHttpServerOptions = {
      ...DEFAULT_OPTS,
      ...opts,
    };

    this.listenOpts = listenOpts;
    this.logging = logging;
    this.instance = http.createServer(listener);
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.instance.listen(this.listenOpts, () => {
          const { address, port } =
						this.instance.address() as AddressInfo;
          this.log(`HTTP Server: starting at ${address}:${port}`);
          resolve();
        });
      } catch (err) {
        this.log('HTTP Server startup ERROR:', err);
        reject(err);
      }
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.instance.close((err) => {
        (err && reject(err)) || resolve();
      });
      this.log('HTTP Server: stopped');
    });
  }

  private log(...args: unknown[]) {
    this.logging && console.log(...args);
  }
}

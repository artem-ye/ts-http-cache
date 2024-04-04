import { HttpServer } from './HttpServer';
import { IHttpServerOptions } from './HttpServer.types';

let server: HttpServer;

export const httpService = {
  start(opts?: IHttpServerOptions) {
    server = new HttpServer(opts);
    return server.start.apply(server);
  },

  stop() {
    return server.stop.apply(server);
  },
};

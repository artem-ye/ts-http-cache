import { HttpServerRequestListener } from '@services/http.service/HttpServer.types';

interface Routes {
  [key: string]: () => string;
}

const routes = {
  ['/']: () => 'Home',
  ['/about']: () => 'About',
} as Routes;

export const router: HttpServerRequestListener = (req, resp) => {
  const { url } = req;
  const handler = routes[url ?? ''];

  if (!handler) {
    resp.statusCode = 404;
    resp.end('Not found');
    return;
  }

  resp.statusCode = 200;
  resp.end(handler());
};

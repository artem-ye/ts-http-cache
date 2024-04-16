import { ICacheService } from '@services/cache.service/';
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

export function createRouter(cache: ICacheService): HttpServerRequestListener {
  const router: HttpServerRequestListener = (req, resp) => {
    const { url } = req as { url: string };
    const handler = routes[url ?? ''];

    if (!handler) {
      resp.statusCode = 404;
      resp.end('Not found');
      return;
    }

    let data = cache.get(url);
    if (!data) {
      data = handler();
      cache.set(url, data, 10000);
      console.log(url, 'cached');
    } else {
      console.log(url, 'hit from cache');
    }

    resp.statusCode = 200;
    resp.end(data);
  };

  return router;
}

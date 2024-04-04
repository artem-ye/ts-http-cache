import http, { RequestListener } from 'node:http';

export interface IHttpServer {
	readonly instance: http.Server;

	start(): Promise<void>;
	stop(): Promise<void>;
}

export type HttpServerRequest = http.IncomingMessage;
export type HttpServerResponse = http.ServerResponse;
export type HttpServerRequestListener = RequestListener;

export interface IHttpServerOptions {
	port?: number;
	host?: string;
	listener?: RequestListener;
	logging?: boolean | undefined;
}

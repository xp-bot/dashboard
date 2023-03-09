import { Socket } from 'socket.io-client';

// eslint-disable-next-line unused-imports/no-unused-vars
export interface ISocketIO<T> extends Socket {}

export interface IPopupPayload {
  title: string;
  content: string;
  type?: `error` | `warning` | `info` | `success`;
  time?: number;
  buttons?: { text: string; url: string }[];
}

export interface IModalPayload {
  title: string;
  content: string;
  type?: `error` | `warning` | `info` | `success`;
  button?: { text: string; url: string };
}

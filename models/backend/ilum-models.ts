export interface IIlumChart {
  data: number[];
  labels: number[];
  online: boolean[];
}

export interface IIlumAlivePing {
  shards: IIlumAlivePingContent[];
}

export interface IIlumAlivePingContent {
  shard_id: number;
  server_count: number;
  websocket_ping: number;
  gateway_connected: boolean;
  updated_at: number;
}

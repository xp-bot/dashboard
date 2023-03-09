export interface IIlumChart {
  data: number[];
  labels: string[];
}

export interface IIlumAlivePing {
  shards: IIlumAlivePingContent[];
}

export interface IIlumAlivePingContent {
  available: boolean;
  shardId: number;
  serverCount: number;
  lastAlivePing: number;
}

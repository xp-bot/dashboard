export interface IIncident {
  incidentID: string;
  content: IIncidentContent;
  createdAt: number;
}

export interface IIncidentContent {
  status: string;
  title: string;
  message: string;
  affected: string[];
  updates: { status: string; message: string; timestamp: number }[];
}

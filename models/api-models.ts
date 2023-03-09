export interface IApiSuccess<Body> {
  success: true;
  message: string;
  body: Body;
}

export interface IApiFailure {
  success: false;
  message: string;
}

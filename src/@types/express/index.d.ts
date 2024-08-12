declare namespace Express {
  export interface Request {
    user?: any;
  }

  export interface Response {
    [key: string]: any;
    status: CallableFunction;
  }
}

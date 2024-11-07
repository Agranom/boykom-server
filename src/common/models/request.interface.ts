import { Request } from 'express';

export interface IUserRequestPayload {
  userId: string;
  username: string;
}

// noinspection JSAnnotator
export interface IRequest extends Request {
  user: IUserRequestPayload;
}

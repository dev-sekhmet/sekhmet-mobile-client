import axios from "axios";
import { Storage } from '../../util/storage-util';
const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

export interface IAuthParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export const authenticate =
  async (auth: IAuthParams) => axios.post<any>('api/authenticate', auth);


export const login = async (username: string, password: string, rememberMe?: boolean) => {
  const result = await authenticate({username, password, rememberMe});
  const bearerToken = result?.headers?.authorization;
  if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
    const jwt = bearerToken.slice(7, bearerToken.length);
    if (rememberMe) {
      Storage.local.set(AUTH_TOKEN_KEY, jwt);
    } else {
      Storage.session.set(AUTH_TOKEN_KEY, jwt);
    }
  }
};

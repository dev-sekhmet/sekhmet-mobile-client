import {TWILIO_ROLE} from "../constants/constants";

export interface IUser {
  id?: any;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: any[];
  createdBy?: string;
  createdDate?: Date | null;
  lastModifiedBy?: string;
  imageUrl?: string;
  lastModifiedDate?: Date | null;
  resetDate?: Date | null;
  password?: string;
  twilioRole?: TWILIO_ROLE;
}

export const defaultValue: Readonly<IUser> = {
  id: '',
  login: '',
  firstName: '',
  lastName: '',
  email: '',
  activated: true,
  langKey: '',
  authorities: [],
  createdBy: '',
  createdDate: null,
  lastModifiedBy: '',
  lastModifiedDate: null,
  resetDate: null,
  imageUrl: null,
  password: '',
};

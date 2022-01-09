import { IChatMember } from './chat-member.model';
import { IMessage } from './message.model';

export interface IChat {
  id?: string;
  icon?: string | null;
  name?: string | null;
  members?: IChatMember[] | null;
  messsages?: IMessage[] | null;
}

export const defaultValue: Readonly<IChat> = {
  messsages: [] as IMessage[],
};

import { IChat } from './chat.model';
import { ChatMemberScope } from './enumerations/chat-member-scope.model';

export interface IChatMember {
  id?: string;
  scope?: ChatMemberScope;
  chat?: IChat | null;
}

export const defaultValue: Readonly<IChatMember> = {};

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Client, Conversation, Message as TwilioMessage} from "@twilio/conversations";
import {AnyAction} from "redux";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}
export type AddMessagesType = (chanMessages: { channelSid: string, messages: TwilioMessage[] }) => AnyAction;
export type SetUreadMessagesType = (chanUnreadCount: {
    channelUniqId: string,
    unreadCount: number
}) => AnyAction;


export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    OnBoarding: undefined;
    Register: undefined;
    InputPhone: undefined;
    VerifyCode: undefined;
    Terms: undefined;
    Modal: undefined;
    NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList,
    Screen>;

export type RootTabParamList = {
    Home: undefined;
    Message: undefined;
    Notification: undefined;
    Profil: undefined;
};
export type ChatParamList = {
    Messages: undefined,
    Chat: {
        clickedConversation: {
            sid: 'aaaaaaaaaaa',
            name: "Gaetan TEMATE"
        }
    },
    ConversationProfile: {
        clickedConversation: {
            sid: 'aaaaaaaaaaa'
        }
    }
};
export type UserListParamList = {
    UserList: {
        title: undefined,
        conversationInfo: undefined
    }
};
export type ProductParamList = {
    ProductDetail: {
        product: {
            id: 1,
            title: 'Muesli Croustilles',
            subtitle: 'By Coach Emy',
            image: {}
        },
        backScreenName: ''
    },
    ProductEdit: {
        product: {
            id: 1,
            title: 'Muesli Croustilles',
            subtitle: 'By Coach Emy',
            image: {}
        },
        backScreenName: ''
    }
};
export type InputPhoneParamList = {
    VerifyCode: {
        phoneNumber: string
    }
};


export type TwilioProps = {
    twilioClient?: Client;
    conversation?: Conversation;
    unreadMessagesCount?: number;
    lastMessage?: string;
    messages?: TwilioMessage[];
    route?: any;
    navigation?: any;
};

export type Message = { msg: TwilioMessage, author: string, deleted?: boolean };

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>>;

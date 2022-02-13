/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Client, Conversation, Message} from "@twilio/conversations";
import {MessageParam} from "./api/message/message.reducer";
import {UnreadCountParam} from "./api/unreadmessage/unreadmessage.reducer";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}



export type SetConvosType = (convos: Conversation[]) => void;
export type AddMessagesType = (mp: MessageParam) => void;
export type SetSidType = (sid: string) => void;
export type SetUreadMessagesType = (um: UnreadCountParam) => void;


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
    }
};
export type InputPhoneParamList = {
    VerifyCode: {
        phoneNumber: string
    }
};


export type TwilioProps = {
    twilioClient?: Client;
    item?: Conversation;
    route?: any;
    navigation?: any;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>>;

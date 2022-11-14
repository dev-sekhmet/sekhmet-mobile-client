import {CONVERSATION_PAGE_SIZE, NOTIFICATION_TIMEOUT, UNEXPECTED_ERROR_MESSAGE} from "../constants/constants";
import {NotificationsType, NotificationVariantType} from "../api/notification/notification.reducer";
import store from "../api/store";
import {Client, Conversation, Message, Paginator, Participant, User} from "@twilio/conversations";
import {AnyAction} from "redux";
import {AddMessagesType, SetUreadMessagesType} from "../types";


type SetConvosType = (convos: Conversation[]) => AnyAction;
export type SetSidType = (sid: string) => AnyAction;
export type SetParticipantsType = (chanParticipants: {
                                       participants: Participant[],
                                       channelSid: string
                                   }
) => AnyAction;


export const getTypingMessage = (typingData: string[]): string =>
    typingData.length > 1
        ? `${typingData.length + " participants are typing..."}`
        : `${typingData[0] + " is typing..."}`;

export const pushNotification = (
    messages: { variant: NotificationVariantType; message: string }[],
    func?: any
): void => {
    if (func) {
        store().dispatch(func(
            messages.map(({variant, message}) => ({
                variant,
                message,
                id: new Date().getTime(),
                dismissAfter: NOTIFICATION_TIMEOUT,
            })))
        );
    }
};

export const successNotification = ({
                                        message,
                                        addNotifications,
                                    }: {
    message: string;
    addNotifications?: (messages: NotificationsType) => void;
}): void => {
    if (!addNotifications) {
        return;
    }
    pushNotification(
        [
            {
                message,
                variant: "success",
            },
        ],
        addNotifications
    );
};

export const unexpectedErrorNotification = (
    addNotifications?: (messages: NotificationsType) => void
): void => {
    if (!addNotifications) {
        return;
    }
    pushNotification(
        [
            {
                message: UNEXPECTED_ERROR_MESSAGE,
                variant: "error",
            },
        ],
        addNotifications
    );
};

export const handlePromiseRejection = async (
    func: () => void,
    addNotifications?: (messages: NotificationsType) => void
): Promise<void> => {
    if (!addNotifications) {
        return;
    }
    try {
        await func();
    } catch (e) {
        unexpectedErrorNotification(addNotifications);
        return Promise.reject(UNEXPECTED_ERROR_MESSAGE);
    }
};

export const updateTypingIndicator = (participant: Participant, sid: string, logInUser: User, callback: (ids: { channelSid: string, participant: string }) => AnyAction) => {
    if (participant.identity === logInUser.identity) {
        return;
    }
    store().dispatch(callback(
        {
            channelSid: sid,
            participant: participant.identity || participant.sid || ""
        }
    ));
}

export async function updateConvoList(
    client: Client,
    conversation: Conversation,
    setConvos: SetConvosType,
    addMessages: AddMessagesType,
    updateUnreadMessages: SetUreadMessagesType
) {
    const messages = await conversation.getMessages();
    store().dispatch(addMessages({
        channelSid: conversation.sid,
        messages: messages.items
    }));
    loadUnreadMessagesCount(conversation, updateUnreadMessages);
    const subscribedConversations = await client.getSubscribedConversations();
    store().dispatch(setConvos(subscribedConversations.items));
}

async function loadUnreadMessagesCount(
    convo: Conversation,
    updateUnreadMessages: SetUreadMessagesType
) {
    const count = await convo.getUnreadMessagesCount();
    store().dispatch(updateUnreadMessages({
        channelUniqId: convo.sid,
        unreadCount: count ?? 0
    }));
}

export const conversationAbsent = (state, channelSid) => {
    return !state.some(conv => {
        if ('channelSid' in conv) {
            return conv.channelSid === channelSid;
        } else {
            return conv.channelUniqId === channelSid;
        }
    });
}

export const updateCurrentConvo = async (
    setSid: SetSidType,
    convo: Conversation,
    updateParticipants: SetParticipantsType
) => {

    setSid(convo.sid);
    try {
        const participants = await convo.getParticipants();
        store().dispatch(updateParticipants(
            {
                channelSid: convo.sid,
                participants
            }
        ));
    } catch {
        return Promise.reject(UNEXPECTED_ERROR_MESSAGE);
    }
}

export const getMessages = async (
    conversation: Conversation
): Promise<Paginator<Message>> =>
    await conversation.getMessages(CONVERSATION_PAGE_SIZE);


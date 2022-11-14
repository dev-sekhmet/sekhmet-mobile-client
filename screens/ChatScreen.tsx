import {FlatList, RefreshControl, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useMemo, useState} from "react";
import MessageBox from "../components/MessageBox";
import MessageInput from "../components/MessageInput";
import Moment from 'moment';
import 'moment/locale/fr'
import {View} from '../components/Themed';
import {Conversation, Message as TwilioMessage, Paginator, User} from "@twilio/conversations";
import {AddMessagesType, Message, TwilioProps} from "../types";
import {useAppDispatch, useAppSelector} from "../api/store";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";
import {getMessages} from "../shared/helpers";
import {addMessages} from "../api/message-list/message-list.reducer";


const pageSize = 10;

export default function ChatScreen({route, navigation, twilioClient}: TwilioProps) {
    const dispatch = useAppDispatch();
    const messageList = useAppSelector(state => state.messageList);
    const conversations = useAppSelector(state => state.convos);
    const lastReadIndex = useAppSelector(state => state.lastReadIndex);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User>(twilioClient.user);
    const [messageReplyTo, setMessageReplyTo] = useState<Message | null>(
        null
    );
    const [refreshing, setRefreshing] = useState(false);
    const [conversation, setConversation] = useState<Conversation>(conversations.find(c => c.sid === route.params.clickedConversation.sid));
    const [paginator, setPaginator] = useState<Paginator<TwilioMessage>>(null);
    const [hasMore, setHasMore] = useState(
        false
    );


    function getConMessages() {
        const msgs = messageList.find(m => m.channelSid === conversation.sid).messages;
        setAuthorMessages(msgs);
        if (!messages && conversation) {
            loadMessages(conversation, messages, addMessages);
        }
    }

    useEffect(() => {
        getConMessages();
    }, []);
    useEffect(() => {
        setConversation(conversations.find(c => c.sid === route.params.clickedConversation.sid))
    }, [conversations]);

    useEffect(() => {
        getMessages(conversation).then((paginator) => {
            setHasMore(paginator.hasPrevPage);
            setPaginator(paginator);
        });
    }, [conversation]);

    useEffect(() => {
        getConMessages();
        updateLastReadIndex();
    }, [messageList, conversations]);

    const updateLastReadIndex = () => {
        if (messages?.length && messages[messages.length - 1].msg.index !== -1) {
            conversation.updateLastReadMessageIndex(messages[messages.length - 1].msg.index);
        }
    }

    const lastConversationReadIndex = useMemo(
        () => {
            const author = messages.length && messages[messages.length - 1]?.msg.author;
            return author !== user.identity
                ? lastReadIndex
                : -1
        },
        [lastReadIndex, messages]
    );

    const loadMessages = async (
        conversation: Conversation,
        currentMessages: Message[],
        addMessage: AddMessagesType
    ): Promise<void> => {
        const convoSid: string = conversation.sid;
        if (!(convoSid in currentMessages)) {
            const paginator = await getMessages(conversation);
            const messages = paginator.items;
            //save to redux
            dispatch(addMessage({
                channelSid: convoSid,
                messages
            }));
        }
    }

    const setAuthorMessages = (msgs) => {
        (async () => {
            const msges = await addMessagesAuthors(msgs);
            setMessages(msges);
        })();
    }
    const addMessagesAuthors = async (items: TwilioMessage[]) => {
        return await Promise.all(items.map(async msg => {
            const user = await twilioClient.getUser(msg.author);
            return {msg: msg, author: user.friendlyName, deleted: false};
        }));
    }

    const getDate = (date: Date): string => {
        return Moment(date).calendar();
    }

    const onRefresh = async () => {
        setRefreshing(true);
        if (!paginator || !hasMore) {
            setRefreshing(false);
            return;
        }

        const result = await paginator?.prevPage();
        if (!result) {
            return;
        }
        const moreMessages = result.items;
        setPaginator(result);
        setHasMore(result.hasPrevPage);
        (async () => {
            const msges = await addMessagesAuthors(moreMessages);
            setMessages(prevMsgs => [...msges, ...prevMsgs])
        })();

        setRefreshing(false);
    };


    if (!conversation) {
        return <SekhmetActivityIndicator/>;
    }
    return (
        <SafeAreaView style={styles.page}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                data={messages}
                renderItem={({item, index}) => (
                    <View>
                        <MessageBox
                            message={item}
                            navigation={navigation}
                            authUser={twilioClient.user}
                            setAsMessageReply={() => setMessageReplyTo(item)}
                        />
                    </View>
                )}
                keyExtractor={item => item.msg.sid}
            />
            <MessageInput
                conversation={conversation}
                messageReplyTo={messageReplyTo}
                removeMessageReplyTo={() => setMessageReplyTo(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        flex: 1,
    },
    day: {
        margin: 10,
        alignSelf: "center",
        color: '#8C8C8C',
    }
});

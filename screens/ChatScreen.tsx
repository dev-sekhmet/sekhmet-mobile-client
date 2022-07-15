import {FlatList, RefreshControl, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from "react";
import MessageBox from "../components/MessageBox";
import MessageInput from "../components/MessageInput";
import Moment from 'moment';
import 'moment/locale/fr'
import {Text, View} from '../components/Themed';
import {Conversation, Message as TwilioMessage, Paginator} from "@twilio/conversations";
import {Message, TwilioProps} from "../types";
import {useAppDispatch} from "../api/store";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";
import {updateLastMessage} from "../api/messages/messages.reducer";

const pageSize = 10;

export default function ChatScreen({route, navigation, twilioClient}: TwilioProps) {
    const dispatch = useAppDispatch();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageReplyTo, setMessageReplyTo] = useState<Message | null>(
        null
    );
    const [refreshing, setRefreshing] = useState(false);
    const [conversation, setConversation] = useState<Conversation>(null);
    const [paginator, setPaginator] = useState<Paginator<TwilioMessage>>(null);
    const [hasMore, setHasMore] = useState(
        false
    );

    useEffect(() => {
        fetchConversation();
        return () => {
            console.log("removeAllListeners ChatScreen")
            conversation?.removeAllListeners();
        }
    }, []);

    useEffect(() => {
        if (conversation) {
            fetchMessages();

            conversation.addListener("messageAdded", (event: TwilioMessage) => {
                console.log("messageAdded: ", event.sid);
                console.log("messages a: ", messages.length);
                if (!messages.some(msg => msg.msg.sid === event.sid)) {
                    console.log("messageAdded: IN ", event.sid);
                    updateMessage(event.sid, event.body, event.dateUpdated);
                    twilioClient.getUser(event.author).then(user => {
                        setMessages(prevMsgs => {
                            return [...prevMsgs, {msg: event, author: user.friendlyName, deleted: false}]
                        });
                    });
                }
            });

            conversation.addListener("messageRemoved", (event: TwilioMessage) => {
                console.log("messageRemoved: ", event.sid);
                console.log("messages r: ", messages.length);
                messages.forEach(msg => console.log("msg.msg", msg.msg.sid));
                if (messages.some(msg => msg.msg.sid === event.sid)) {
                    console.log("messageRemoved IN: ", event.sid);
                    setMessages(prevMsgs => {
                        const newMsgs = prevMsgs.map(msg => {
                            if (msg.msg.sid === event.sid) {
                                return {...msg, deleted: true};
                            }
                            return msg;
                        });
                        return [...newMsgs]
                    });
                }
            });
        }
    }, [conversation]);


    const updateMessage = (channelSid: string, message: string, dateUpdated: Date | null) => {
        dispatch(updateLastMessage({
            channelSid,
            lastMessage: {
                message,
                dateUpdated
            }
        }));
    }

    const fetchConversation = async () => {
        console.log("fetchConversation")
        const sid = route.params.clickedConversation.sid;
        if (twilioClient && sid) {
            twilioClient.getConversationBySid(sid).then(conversation => {
                setConversation(conversation);
            });
        }
    };

    const addAuthors = async (items: TwilioMessage[]) => {
        return await Promise.all(items.map(async msg => {
            const user = await twilioClient.getUser(msg.author);
            return {msg: msg, author: user.friendlyName, deleted: false};
        }));
    }

    const fetchMessages = async () => {
        conversation.getMessages(pageSize).then(paginator => {
            if (paginator && paginator.items && paginator.items.length > 0) {

                setHasMore(paginator.hasPrevPage);
                setPaginator(paginator);

                (async () => {
                    const msges = await addAuthors(paginator.items);
                    console.log("msges", msges.length);
                    setMessages(msges);
                })();
                conversation.setAllMessagesRead();
            }
        })
    };


    const getDate = (date: Date): string => {
        return Moment(date).calendar();
    }

    const canAddDaySeparator = (dateUpdated: Date, index: number, messages: Message[]): boolean => {
        const nextIndex = index + 1;
        if (index === 0) {
            return true;
        }

        if (nextIndex <= messages.length - 1) {
            const dateUpdatedAtNext = messages[nextIndex].msg.dateUpdated;
            return !Moment(dateUpdated).isSame(dateUpdatedAtNext, 'day');
        }
        return false;
    }


    const onRefresh = async () => {
        setRefreshing(true);
        if (!paginator) {
            setRefreshing(false);
            return;
        }
        if (!hasMore) {
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
            const msges = await addAuthors(moreMessages);
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
                        {canAddDaySeparator(item.msg.dateUpdated, index, messages) && <Text
                            style={styles.day}
                        >{getDate(item.msg.dateUpdated)}</Text>}
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

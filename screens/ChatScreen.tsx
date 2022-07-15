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
        console.log("useEffect: ChatScreen")
        Moment.updateLocale('fr', {
            calendar: {
                sameDay: '[Aujourd\'hui]',
                nextDay: '[Demain]',
                nextWeek: 'dddd',
                lastDay: '[Hier]',
                lastWeek: 'dddd [dernier]',
                sameElse: 'DD/MM/YYYY'
            }
        })
        fetchChatRoom();
        return () => {
            console.log("removeAllListeners ChatScreen")
            conversation?.removeAllListeners();
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [conversation]);

    const getUser = async (identity: string) => {
        const user = await twilioClient.getUser(identity);
        return user.friendlyName;
    }

    const fetchChatRoom = async () => {
        const sid = route.params.clickedConversation.sid;
        if (twilioClient && sid) {
            twilioClient.getConversationBySid(sid).then(conversation => {
                setConversation(conversation);
                conversation.on("messageAdded", (event: TwilioMessage) => {
                    if (!messages.some(msg => msg.msg.sid === event.sid)) {
                        twilioClient.getUser(event.author).then(user => {
                            setMessages(prevMsgs => {
                                return [...prevMsgs, {msg: event, author: user.friendlyName}]
                            });
                        });
                    }
                });
            });
        }
    };

     const addAuthors = async (items: TwilioMessage[]) => {
        return await Promise.all(items.map(async msg => {
            console.log("msg: ", msg.body)
            console.log("lastUpdatedBy: ", msg.author)
            const user = await twilioClient.getUser(msg.author);
            return {msg: msg, author: user.friendlyName}
        }));
    }

    const fetchMessages = async () => {
        if (conversation) {
            conversation.getMessages(pageSize).then(paginator => {
                if (paginator && paginator.items && paginator.items.length > 0) {

                    setHasMore(paginator.hasPrevPage);
                    setPaginator(paginator);

                    (async () => {
                        const msges = await addAuthors(paginator.items);
                        setMessages(msges);
                    })();
                    conversation.setAllMessagesRead();
                }
            })
        }
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
        console.log("result.items ", result.items.length)
        console.log("result.hasPrevPa ge ", result.hasPrevPage)
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

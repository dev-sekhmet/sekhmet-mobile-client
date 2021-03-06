import {FlatList, RefreshControl, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from "react";
import MessageBox from "../components/MessageBox";
import MessageInput from "../components/MessageInput";
import Moment from 'moment';
import 'moment/locale/fr'
import {Text, View} from '../components/Themed';
import {Conversation, Message, Paginator} from "@twilio/conversations";
import {TwilioProps} from "../types";
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
    const [paginator, setPaginator] = useState<Paginator<Message>>(null);
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

    const fetchChatRoom = async () => {
        const sid = route.params.clickedConversation.sid;
        if (twilioClient && sid) {
            twilioClient.getConversationBySid(sid).then(conversation => {
                setConversation(conversation);
                conversation.on("messageAdded", (event: Message) => {
                    setMessages(prevMsgs => {
                        if (prevMsgs.some(msg=>msg.sid === event.sid)){
                            return  [...prevMsgs]
                        } else {
                            return [...prevMsgs, event]
                        }
                    });
                });
            });
        }
    };

    const fetchMessages = async () => {
        if (conversation) {
            conversation.getMessages(pageSize).then(paginator => {
                if (paginator && paginator.items && paginator.items.length>0) {
                    setHasMore(paginator.hasPrevPage);
                    setPaginator(paginator);
                    setMessages(paginator.items);
                    conversation.setAllMessagesRead();
                }})
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
            const dateUpdatedAtNext = messages[nextIndex].dateUpdated;
            return !Moment(dateUpdated).isSame(dateUpdatedAtNext, 'day');
        }
        return false;
    }


    const onRefresh = async () => {
        setRefreshing(true);
        if (!paginator) {
            setRefreshing(false);
            return;
        }if (!hasMore) {
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
        setMessages(prevMsgs => [ ...moreMessages, ...prevMsgs])
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
                        {canAddDaySeparator(item.dateUpdated, index, messages) && <Text
                            style={styles.day}
                        >{getDate(item.dateUpdated)}</Text>}
                        <MessageBox
                            message={item}
                            navigation={navigation}
                            authUser={twilioClient.user}
                            setAsMessageReply={() => setMessageReplyTo(item)}
                        />
                    </View>
                )}
                keyExtractor={item => item.sid}
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

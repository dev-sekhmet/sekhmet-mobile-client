import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/core";
import {IMessage as MessageModel} from "../model/message.model";
import {IChat} from "../model/chat.model";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import {messages as messagesData} from './sampleData';
import Moment from 'moment';
import 'moment/locale/fr'
import {Text, View} from '../components/Themed';

export default function ChatScreen() {
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messageReplyTo, setMessageReplyTo] = useState<MessageModel | null>(
        null
    );
    const [chatRoom, setChatRoom] = useState<IChat | null>(null);

    const route = useRoute();
    const navigation = useNavigation();


    useEffect(() => {
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
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [chatRoom]);

    useEffect(() => {
        /*        const subscription = DataStore.observe(MessageModel).subscribe((msg) => {
                    // console.log(msg.model, msg.opType, msg.element);
                    if (msg.model === MessageModel && msg.opType === "INSERT") {
                        setMessages((existingMessage) => [msg.element, ...existingMessage]);
                    }
                });

                return () => subscription.unsubscribe();*/
        setMessages(messagesData)
    }, []);

    const fetchChatRoom = async () => {
        /* if (!route.params?.id) {
             console.warn("No chatroom id provided");
             return;
         }
         const chatRoom = await DataStore.query(ChatRoom, route.params.id);
         if (!chatRoom) {
             console.error("Couldn't find a chat room with this id");
         } else {
             setChatRoom(chatRoom);
         }*/
    };

    const fetchMessages = async () => {
        /* if (!chatRoom) {
             return;
         }
         const authUser = await Auth.currentAuthenticatedUser();
         const myId = authUser.attributes.sub;

         const fetchedMessages = await DataStore.query(
             MessageModel,
             (message) => message.chatroomID("eq", chatRoom?.id).forUserId("eq", myId),
             {
                 sort: (message) => message.createdAt(SortDirection.DESCENDING),
             }
         );*/
        // console.log(fetchedMessages);
        //setMessages(fetchedMessages);
        setMessages(messagesData);
    };

    if (!chatRoom) {
        //return <ActivityIndicator />;
    }

    const getDate = (date: string): string => {
        return Moment(date).calendar();
    }
    return (
        <SafeAreaView style={styles.page}>
            <FlatList
                data={messages}
                renderItem={({item}) => (
                    <View>
                        <Text
                            style={styles.day}
                        >{getDate(item.createdAt)}</Text>
                        <Message
                            message={item}
                            setAsMessageReply={() => setMessageReplyTo(item)}
                        />
                    </View>
                )}
                inverted
            />
            <MessageInput
                chatRoom={chatRoom}
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
        alignSelf:"center",
        color: '#8C8C8C',
    }
});

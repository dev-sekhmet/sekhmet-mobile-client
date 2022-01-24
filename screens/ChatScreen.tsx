import {
    StyleSheet,
    FlatList,
    SafeAreaView,
    ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/core";
import { IMessage as MessageModel } from "../model/message.model";
import { IChat } from "../model/chat.model";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { messages as messagesData } from './sampleData';

export default function ChatScreen() {
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messageReplyTo, setMessageReplyTo] = useState<MessageModel | null>(
        null
    );
    const [chatRoom, setChatRoom] = useState<IChat | null>(null);

    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
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
  return (
      <SafeAreaView style={styles.page}>
        <FlatList
            data={messages}
            renderItem={({ item }) => (
                <Message
                    message={item}
                    setAsMessageReply={() => setMessageReplyTo(item)}
                />
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
});

import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, StyleSheet, TextInput} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import WebSocketClient from '../service/WebSocketClient';
import {Text, View} from '../components/Themed';

export default function TabTwoScreen() {

    const [name, setName] = useState('');
    const [isEnter, setIsEnter] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        return () => WebSocketClient.close();
    }, []);

    useEffect(() => {
        WebSocketClient.onReceiveMessage = (newMessage: any) => {
            setMessages(GiftedChat.append(messages, newMessage));
        };
    }, [messages]);

    const onSend = (newMessages: any) => {
        WebSocketClient.send(newMessages[0]);
    };

    if (!isEnter)
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Tab Two</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
                <TextInput
                    style={styles.textInput}
                    textAlign="center"
                    value={name}
                    placeholder="Name"
                    onChangeText={(text) => setName(text)}
                />
                <Button title="Enter" onPress={() => setIsEnter(true)}/>
            </View>
        );
    else {
        const user = {
            _id: name,
            name,
            avatar:
                'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375__340.png',
        };
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Tab Two</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
                    <GiftedChat
                        messages={messages}
                        onSend={(newMessages) => onSend(newMessages)}
                        user={user}
                        timeTextStyle={{left: {color: 'red'}, right: {color: 'yellow'}}}
                        renderUsernameOnMessage
                    />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '50%',
    }
});

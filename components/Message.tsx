import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Alert, Image,
} from 'react-native';
import { IUser } from '../model/user.model'
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AudioPlayer from './AudioPlayer';
import { IMessage as MessageModel } from '../model/message.model';
import MessageReply from './MessageReply';
import { box } from 'tweetnacl';
import {IChat} from "../model/chat.model";

const blue = '#3777f0';
const grey = 'lightgrey';

const Message = (props) => {
    const { setAsMessageReply, message: propMessage } = props;

    const [message, setMessage] = useState<MessageModel>(propMessage);
    const [decryptedContent, setDecryptedContent] = useState("");
    const [repliedTo, setRepliedTo] = useState<MessageModel | undefined>(
        undefined
    );
    const [user, setUser] = useState<IUser | undefined>();
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [soundURI, setSoundURI] = useState<any>(null);
    const [isDeleted, setIsDeleted] = useState(false);

    const { width } = useWindowDimensions();
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        setUser({
            id: 'ssss',
            login: 'ddd',
            firstName: 'dddd',
            lastName: 'qssxs',
            email: '',
            activated: true,
            langKey: '',
            authorities: [],
            createdBy: '',
            createdDate: null,
            lastModifiedBy: '',
            lastModifiedDate: null,
            password: '',
        });
    }, []);

    useEffect(() => {
        setMessage(propMessage);
    }, [propMessage]);

    useEffect(() => {
        if (message?.replyToMessageID) {
            setRepliedTo({
                id: "string",
                text: "string",
                createdAt: "string",
                image: "string",
                video: "string",
                file: "string",
                audio: "string",
                contentTypeMedia: "string",
                system: false,
                sent: false,
                received: false,
                pending: false,
                chat: null,
                user: null
            })
        }
    }, [message]);

    useEffect(() => {
        // subscription to websocket chat
      /*  const subscription = DataStore.observe(MessageModel, message.id).subscribe(
            (msg) => {
                if (msg.model === MessageModel) {
                    if (msg.opType === "UPDATE") {
                        setMessage((message) => ({ ...message, ...msg.element }));
                    } else if (msg.opType === "DELETE") {
                        setIsDeleted(true);
                    }
                }
            }
        );

        return () => subscription.unsubscribe();*/
    }, []);

    useEffect(() => {
        setAsRead();
    }, [isMe, message]);

    useEffect(() => {
        if (message.audio) {
            /*Storage.get(message.audio).then(setSoundURI);*/
            setSoundURI(message.audio);
        }
    }, [message]);

    useEffect(() => {
        const checkIfMe = async () => {
            if (!user) {
                return;
            }
            //const authUser = await Auth.currentAuthenticatedUser();
            const authUser = {
                id: 'ssss',
                login: 'ddd',
                firstName: 'dddd',
                lastName: 'qssxs',
                email: '',
                activated: true,
                langKey: '',
                authorities: [],
                createdBy: '',
                createdDate: null,
                lastModifiedBy: '',
                lastModifiedDate: null,
                password: '',
            };
            setIsMe(user.id === authUser.id);
        };
        checkIfMe();
    }, [user]);

    useEffect(() => {
        //if (!message?.content || !user?.publicKey) {
        if (!message?.text) {
            return;
        }

/*        const decryptMessage = async () => {
            const myKey = await getMySecretKey();
            if (!myKey) {
                return;
            }
            // decrypt message.content
            const sharedKey = box.before(stringToUint8Array(user.publicKey), myKey);
            console.log("sharedKey", sharedKey);
            const decrypted = decrypt(sharedKey, message.content);
            console.log("decrypted", decrypted);
            setDecryptedContent(decrypted.message);
        };

        decryptMessage();*/
    }, [message, user]);

    const setAsRead = async () => {
        if (isMe === false && message.read) {
/*            await DataStore.save(
                MessageModel.copyOf(message, (updated) => {
                    updated.status = "READ";
                })
            );*/
        }
    };

    const deleteMessage = async () => {
       // await DataStore.delete(message);
    };

    const confirmDelete = () => {
        Alert.alert(
            "Confirm delete",
            "Are you sure you want to delete the message?",
            [
                {
                    text: "Delete",
                    onPress: deleteMessage,
                    style: "destructive",
                },
                {
                    text: "Cancel",
                },
            ]
        );
    };

    const onActionPress = (index) => {
        if (index === 0) {
            setAsMessageReply();
        } else if (index === 1) {
            if (isMe) {
                confirmDelete();
            } else {
                Alert.alert("Can't perform action", "This is not your message");
            }
        }
    };

    const openActionMenu = () => {
        const options = ["Reply", "Delete", "Cancel"];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            onActionPress
        );
    };

    if (!user) {
        return <ActivityIndicator />;
    }

    return (
        <Pressable
            onLongPress={openActionMenu}
            style={[
                styles.container,
                isMe ? styles.rightContainer : styles.leftContainer,
                { width: soundURI ? "75%" : "auto" },
            ]}
        >
            {repliedTo && <MessageReply message={repliedTo} />}
            <View style={styles.row}>
                {message.image && (
                    <View style={{ marginBottom: message.text ? 10 : 0 }}>
                        <Image
                            source={{uri: message.image}}
                            style={{width: width * 0.65, aspectRatio: 4 / 3}}/>
                    </View>
                )}
                {soundURI && <AudioPlayer soundURI={soundURI} />}
                {!!decryptedContent && (
                    <Text style={{ color: isMe ? "black" : "white" }}>
                        {isDeleted ? "message deleted" : decryptedContent}
                    </Text>
                )}

                {isMe && !!message.sent && (
                    <Ionicons
                        name={
                            message.received ? "checkmark" : "checkmark-done"
                        }
                        size={16}
                        color="gray"
                        style={{ marginHorizontal: 5 }}
                    />
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        maxWidth: "75%",
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    messageReply: {
        backgroundColor: "gray",
        padding: 5,
        borderRadius: 5,
    },
    leftContainer: {
        backgroundColor: blue,
        marginLeft: 10,
        marginRight: "auto",
    },
    rightContainer: {
        backgroundColor: grey,
        marginLeft: "auto",
        marginRight: 10,
        alignItems: "flex-end",
    },
});

export default Message;
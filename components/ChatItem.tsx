import {Pressable, StyleSheet} from 'react-native';
import {Text, View} from './Themed';
import {Badge} from "react-native-elements";
import React, {useEffect, useState} from "react";
import Colors from "../constants/Colors";
import {Conversation, ConversationUpdateReason, Message} from "@twilio/conversations";
import Moment from "moment";
import {TwilioProps} from "../types";
import {useAppDispatch, useAppSelector} from "../api/store";
import {from} from "rxjs";
import {updateLastMessage, updateUnreadMessagesCount} from "../api/messages/messages.reducer";
import {getFriendlyName, getImageUrl} from "../shared/conversation/conversation.util";
import {APP_TIME_FORMAT} from "../constants/constants";
import ProfilAvatar from "./ProfilAvatar";


export default function ChatItem({item, navigation}: TwilioProps) {

    const dispatch = useAppDispatch();
    const lastMessages = useAppSelector(state => state.messages.lastMessages);
    const unreadmessageCount = useAppSelector(state => state.messages.unreadMessagesCount);
    const account = useAppSelector(state => state.authentification.account);
    const [friendlyName, setFriendlyName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const updateUnreadMessageCount = (item: Conversation) => {
        from(item.getUnreadMessagesCount()).subscribe(nb => {
            dispatch(updateUnreadMessagesCount({channelSid: item.sid, unreadCount: nb}))
        })
    }

    const updateMessage = (channelSid: string, message: string, dateUpdated: Date | null) => {
        dispatch(updateLastMessage({
            channelSid,
            lastMessage: {
                message,
                dateUpdated
            }
        }));
    }

    useEffect(() => {
        updateUnreadMessageCount(item);
        if(account){
          setFriendlyName(getFriendlyName(item, account));
          setImageUrl(getImageUrl(item, account));
        }
        // get last message
        item.getMessages(1).then(res => {
            if (res.items && res.items.length > 0) {
                const message = res.items[0];
                updateMessage(item.sid, message.body, message.dateUpdated);
            }
        })
        item.on("messageAdded", (message: Message) => {
            updateMessage(item.sid, message.body, message.dateUpdated);
        });

        item.on("updated", (data: { conversation: Conversation, updateReasons: ConversationUpdateReason[] }) => {
            updateUnreadMessageCount(data.conversation);
        });

        return () => {
            console.log("removeAllListeners chatitem")
            item?.removeAllListeners();
        }
    }, []);

    const onPress = () => {
        navigation.navigate("Chat", {
            clickedConversation: {
                sid: item.sid,
                name: friendlyName,
                imageUrl: imageUrl
            }
        });
    };

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <ProfilAvatar
                size={60}
                key={account.imageUrl}
                title={friendlyName.charAt(0)}
                imageUrl={imageUrl}
            />

            {/*{item?.user?.isCoach &&*/}
            <Badge
                value={"C"}
                textStyle={styles.badgeText}
                badgeStyle={styles.badgeContainer}
            />

            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={styles.name}>{friendlyName}</Text>

                        <Badge
                            badgeStyle={{backgroundColor: Colors.light.online, marginBottom: 8, marginLeft: 6}}
                        />
                    </View>
                    {unreadmessageCount[item.sid] > 0 &&
                    <Badge
                        value={unreadmessageCount[item.sid]}
                        badgeStyle={{backgroundColor: Colors.light.sekhmetGreen}}>
                    </Badge>}
                </View>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.text}>
                        {lastMessages[item.sid] && lastMessages[item.sid].message}
                    </Text>
                    <Text style={styles.text}>{lastMessages[item.sid] && Moment(lastMessages[item.sid].dateUpdated).format(APP_TIME_FORMAT)}</Text>
                </View>

            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,

    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 30,
        marginRight: 10,
    },
    badgeContainer: {
        backgroundColor: Colors.light.sekhmetOrange,

        borderWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        left: -20,
        top: 40,
    },
    badgeText: {
        color: 'white',
        fontSize: 12
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 3,
    },
    text: {
        color: 'grey',
    }
});

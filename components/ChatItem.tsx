import {Pressable, StyleSheet} from 'react-native';
import {Text, View} from './Themed';
import {Badge} from "react-native-elements";
import React, {useEffect, useState} from "react";
import Colors from "../constants/Colors";
import {Message} from "@twilio/conversations";
import {TwilioProps} from "../types";
import {useAppDispatch, useAppSelector} from "../api/store";
import {getFriendlyName, getImageUrl} from "../shared/conversation/conversation.util";
import ProfilAvatar from "./ProfilAvatar";
import {unexpectedErrorNotification, updateCurrentConvo} from "../shared/helpers";
import {addNotifications} from "../api/notification/notification.reducer";
import {setLastReadIndex} from "../api/last-read-index/last-read-index.reducer";
import {updateCurrentConversation} from "../api/current-conv/current-conv.reducer";
import {updateParticipants} from "../api/participants/participants.reducer";
import {updateUnreadMessages} from "../api/unread-message/unread-messages.reducer";


export default function ChatItem({item, navigation, lastMessage, unreadMessagesCount, messages}: TwilioProps) {

    const dispatch = useAppDispatch();
    const account = useAppSelector(state => state.authentification.account);
    const [friendlyName, setFriendlyName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const lastMessageTime = getLastMessageTime(messages);

    useEffect(() => {
        if (account) {
            setFriendlyName(getFriendlyName(item, account));
            setImageUrl(getImageUrl(item, account));
        }
    }, []);

    function getLastMessageTime(messages: Message[]) {
        if (messages === undefined || messages === null || messages.length === 0) {
            return "";
        }
        const lastMessageDate = messages[messages.length - 1].dateCreated;
        const today = new Date();
        const diffInDates = Math.floor(today.getTime() - lastMessageDate.getTime());
        const dayLength = 1000 * 60 * 60 * 24;
        const weekLength = dayLength * 7;
        const yearLength = weekLength * 52;
        const diffInDays = Math.floor(diffInDates / dayLength);
        const diffInWeeks = Math.floor(diffInDates / weekLength);
        const diffInYears = Math.floor(diffInDates / yearLength);
        if (diffInDays < 0) {
            return "";
        }
        if (diffInDays === 0) {
            const minutesLessThanTen = lastMessageDate.getMinutes() < 10 ? "0" : "";
            return (
                lastMessageDate.getHours().toString() +
                ":" +
                minutesLessThanTen +
                lastMessageDate.getMinutes().toString()
            );
        }
        if (diffInDays === 1) {
            return "1 day ago";
        }
        if (diffInDays < 7) {
            return diffInDays + " days ago";
        }
        if (diffInDays < 14) {
            return "1 week ago";
        }
        if (diffInWeeks < 52) {
            return diffInWeeks + " weeks ago";
        }
        if (diffInYears < 2) {
            return "1 year ago";
        }
        return diffInYears + " years ago";
    }

    const onPress = async () => {
        try {
            dispatch(setLastReadIndex(item.lastReadMessageIndex ?? -1));
            await updateCurrentConvo(
                updateCurrentConversation,
                item,
                updateParticipants
            );
            //update unread messages
            dispatch(updateUnreadMessages({
                channelUniqId: item.sid,
                unreadCount: 0
            }));
            //set messages to be read
            const lastMessage =
                messages.length &&
                messages[item.sid]
               ? messages[messages[item.sid].length - 1] : null;
            if (lastMessage && lastMessage.index !== -1) {
                await item.updateLastReadMessageIndex(lastMessage.index);
            }
        } catch (e) {
            console.error(e);
            unexpectedErrorNotification(addNotifications);
        }
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
                    {unreadMessagesCount > 0 &&
                        <Badge
                            value={unreadMessagesCount}
                            badgeStyle={{backgroundColor: Colors.light.sekhmetGreen}}>
                        </Badge>}
                </View>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.text}>
                        {lastMessage}
                    </Text>
                    <Text style={styles.text}>{lastMessage && lastMessageTime}</Text>
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

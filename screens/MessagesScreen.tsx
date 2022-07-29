import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import ChatItem from "../components/ChatItem";
import * as React from "react";
import {useEffect, useState} from "react";
import {Badge} from "react-native-elements";
import {useAppDispatch, useAppSelector} from "../api/store";
import {Conversation, Message} from "@twilio/conversations";
import {TwilioProps} from "../types";
import {reset} from "../api/settings/settings.reducer";
import NewConversation from "../components/NewConversation";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";
import {hasAnyAuthority} from "../components/PrivateRoute";
import {AUTHORITIES, CONVERSATION_TYPE} from "../constants/constants";
import {getTypingMessage} from "../shared/helpers";
import {ChannelMessageCountType} from "../api/unread-message/unread-messages.reducer";

const height = Dimensions.get('screen').height;

export default function MessagesScreen({navigation, twilioClient}: TwilioProps) {
    const conversations = useAppSelector(state => state.convos);
    const unreadMessages = useAppSelector(state => state.unreadMessages);
    const [dualConversations, setDualConversations] = useState<Conversation[]>([]);
    const [groupConversations, setGroupConversations] = useState<Conversation[]>([]);

    const isConversationGroup = (c: Conversation): boolean => {
        return isConversation(c, CONVERSATION_TYPE.GROUP);
    }

    const isConversationDual = (c: Conversation): boolean => {
        return isConversation(c, CONVERSATION_TYPE.DUAL);
    }

    const isConversation = (c: Conversation, type: string): boolean => {
        return isUniqueName(c.uniqueName, type);
    }
    const isUniqueName = (uniqueName: string, type: string): boolean => {
        return uniqueName.includes(type);
    }
    const isUniqueNameDual = (uniqueName: string): boolean => {
        return uniqueName.includes(CONVERSATION_TYPE.DUAL);
    }
    const isUniqueNameGroup = (uniqueName): boolean => {
        return uniqueName.includes(CONVERSATION_TYPE.GROUP);
    }

    useEffect(() => {
        if (twilioClient) {
            setDualConversations(conversations.filter(c => isConversationDual(c)));
            setGroupConversations(conversations.filter(c => isConversationGroup(c)));
        }

    }, [conversations])

    useEffect(() => {
        return () => {
            twilioClient?.removeAllListeners();
        }
    }, [])


    const Tab = createMaterialTopTabNavigator();

    function getUnReadMessageCountCount(isUniqueName: (string)=> boolean) {
        return unreadMessages.filter((un: ChannelMessageCountType) => isUniqueName(un.channelUniqId))
            // @ts-ignore
            .reduce((prev, curr) => prev.unreadCount + curr.unreadCount, 0);
    }

    return (
        <Tab.Navigator initialRouteName={"Discussion"}
                       screenOptions={{
                           tabBarActiveTintColor: Colors.light.sekhmetGreen,
                           tabBarIndicatorStyle: {backgroundColor: Colors.light.sekhmetGreen},
                           tabBarLabelStyle: {fontSize: 12},
                       }}
        >
            <Tab.Screen name="Discussion"
                        options={{
                            tabBarLabel: () => {

                                const count = getUnReadMessageCountCount(isUniqueNameDual);
                                return <View
                                    style={styles.tabItem}>
                                    <Text style={{color: Colors.light.sekhmetGreen}}>Discussions</Text>
                                    {count > 0 && <Badge
                                        value={count}
                                        badgeStyle={{marginVertical: 10, backgroundColor: Colors.light.sekhmetGreen}}
                                    />}
                                </View>;
                            }
                        }}
                        children={() => <Discussion navigation={navigation} conversations={dualConversations}/>}/>
            <Tab.Screen name="Groupes"
                        options={{
                            tabBarLabel: () => {
                                const count = getUnReadMessageCountCount(isUniqueNameGroup);
                                return <View style={styles.tabItem}>
                                    <Text style={{color: Colors.light.sekhmetGreen}}>Groupes</Text>
                                    {count > 0 && <Badge
                                        value={count}
                                        badgeStyle={{marginVertical: 10, backgroundColor: Colors.light.sekhmetGreen}}
                                    />}
                                </View>
                            }
                        }}
                        children={() => <Groupes navigation={navigation} conversations={groupConversations}/>}/>

        </Tab.Navigator>

    );
}


function getLastMessage(messages: Message[], typingData: string[]) {
    if (messages === undefined || messages === null) {
        return "Loading...";
    }
    if (typingData.length) {
        return getTypingMessage(typingData);
    }
    if (messages.length === 0) {
        return "No messages";
    }
    if (!!messages[messages.length - 1].attachedMedia.length) {
        return "Media message";
    }
    return messages[messages.length - 1].body;
}

const Discussion = ({navigation, conversations}: { conversations?: Conversation[]; navigation?: any; }) => {
    const dispatch = useAppDispatch();
    const updateSuccess = useAppSelector<boolean>(state => state.conversationWrite.updateSuccess);
    const loadingConversation = useAppSelector<boolean>(state => state.conversationWrite.loading);
    const updateFailure = useAppSelector<boolean>(state => state.conversationWrite.updateFailure);
    const unreadMessages = useAppSelector(state => state.unreadMessages);
    const typingData = useAppSelector(state => state.typingData);
    const messages = useAppSelector(state => state.messageList);
    useEffect(() => {
        if (updateSuccess) {
            console.log('OK');
        }
        if (updateFailure) {
            console.log('KO');
        }
        dispatch(reset());
        return () => {
            dispatch(reset());
        };
    }, [updateSuccess, updateFailure]);

    return (loadingConversation ? <SekhmetActivityIndicator/> : <View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => {
                const unreadMessagesCount = unreadMessages.find(c => c.channelUniqId === item.sid)?.unreadCount ?? 0;
                console.log('unreadMessagesCount', unreadMessagesCount, item.friendlyName);
                return (
                    <ChatItem conversation={item}
                              messages={messages.find(m => m.channelSid === item.sid)?.messages}
                              lastMessage={getLastMessage(
                                  messages.find(tp => tp.channelSid === item.sid)?.messages ?? [],
                                  typingData.find(tp => tp.channelSid === item.sid)?.participants ?? []
                              )}

                              unreadMessagesCount={
                                  unreadMessagesCount
                              }
                              navigation={navigation}/>
                );
            }}
            keyExtractor={item => item.sid}
        />
        <NewConversation navigation={navigation}
                         conversationInfo={{label: "Nouvelle discussion", type: CONVERSATION_TYPE.DUAL}}/>
    </View>)
}


const Groupes = ({navigation, conversations}) => {
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentification.account.authorities,
        [AUTHORITIES.ADMIN]));
    const unreadMessages = useAppSelector(state => state.unreadMessages);
    const typingData = useAppSelector(state => state.typingData);
    const messages = useAppSelector(state => state.messageList);
    return <View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => (
                <ChatItem conversation={item}
                          messages={messages.find(m => m.channelSid === item.sid)?.messages}
                          lastMessage={getLastMessage(
                              messages.find(tp => tp.channelSid === item.sid)?.messages ?? [],
                              typingData.find(tp => tp.channelSid === item.sid)?.participants ?? []
                          )}
                          unreadMessagesCount={
                              unreadMessages.find(c => c.channelUniqId === item.sid)?.unreadCount ?? 0
                          }
                          navigation={navigation}/>
            )}
            keyExtractor={item => item.sid}
        />
        {isAdmin && <NewConversation navigation={navigation}
                                     conversationInfo={{label: "Nouveau Groupe", type: CONVERSATION_TYPE.GROUP}}/>}
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 120,
        alignItems: 'center',
    }
});

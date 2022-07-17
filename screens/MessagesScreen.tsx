import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import ChatItem from "../components/ChatItem";
import * as React from "react";
import {useEffect, useState} from "react";
import {Badge} from "react-native-elements";
import {useAppDispatch, useAppSelector} from "../api/store";
import {Conversation} from "@twilio/conversations";
import {TwilioProps} from "../types";
import {reset} from "../api/settings/settings.reducer";
import NewConversation from "../components/NewConversation";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";
import {hasAnyAuthority} from "../components/PrivateRoute";
import {AUTHORITIES, CONVERSATION_MESSAGES, CONVERSATION_TYPE} from "../constants/constants";
import {successNotification} from "../shared/helpers";
import {addNotifications} from "../api/notification/notification.reducer";

const height = Dimensions.get('screen').height;

export default function MessagesScreen({navigation, twilioClient}: TwilioProps) {
    const loginSuccess = useAppSelector(state => state.authentification.loginSuccess);
    const unreadmessageCount = useAppSelector(state => state.messages.unreadMessagesCount);
    const [dualConversations, setDualConversations] = useState<Conversation[]>([]);
    const [groupConversations, setGroupConversations] = useState<Conversation[]>([]);

    const isConversationGroup = (c: Conversation) : boolean => {
        return isConversation(c, CONVERSATION_TYPE.GROUP);
    }

    const isConversationDual = (c: Conversation) : boolean => {
        return isConversation(c, CONVERSATION_TYPE.DUAL);
    }
    const isConversation = (c: Conversation, type: string): boolean => {
        return c.uniqueName.includes(type);
    }

    useEffect(() => {
        successNotification({
            message: CONVERSATION_MESSAGES.LEFT,
            addNotifications,
        });

        if (twilioClient) {
            const initConversations = async () => {
                const cons = await twilioClient.getSubscribedConversations();
                setDualConversations(cons.items.filter(c => isConversationDual(c)));
                setGroupConversations(cons.items.filter(c => isConversationGroup(c)));
                twilioClient.addListener("conversationAdded", async (conversation: Conversation) => {
                    conversation.setAllMessagesUnread();
                    if (isConversationGroup(conversation)) {
                        setGroupConversations(oldConversations => [conversation, ...oldConversations]);
                    } else {
                        setDualConversations(oldConversations => [conversation, ...oldConversations]);
                    }
                });
                twilioClient.addListener("conversationRemoved", (conversation: Conversation) => {

                });
            }
            initConversations();
        }

    }, [])

    useEffect(() => {
        return () => {
            twilioClient?.removeAllListeners();
        }
    }, [])


    const Tab = createMaterialTopTabNavigator();
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
                                const count = Object.values<number>(unreadmessageCount)
                                    .reduce((prev, curr) => prev + curr, 0);
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
                            tabBarLabel: () => <View style={styles.tabItem}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Groupes</Text>
                            </View>
                        }}
                        children={() => <Groupes navigation={navigation} conversations={groupConversations}/>}/>

        </Tab.Navigator>

    );
}

const Discussion = ({navigation, conversations}: { conversations?: Conversation[]; navigation?: any; }) => {
    const dispatch = useAppDispatch();
    const updateSuccess = useAppSelector<boolean>(state => state.conversationWrite.updateSuccess);
    const loadingConversation = useAppSelector<boolean>(state => state.conversationWrite.loading);
    const updateFailure = useAppSelector<boolean>(state => state.conversationWrite.updateFailure);

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
            renderItem={({item}) => (
                <ChatItem item={item} navigation={navigation}/>
            )}
            keyExtractor={item => item.sid}
        />
        <NewConversation navigation={navigation}
                         conversationInfo={{label: "Nouvelle discussion", type: CONVERSATION_TYPE.DUAL}}/>
    </View>)
}

const Groupes = ({navigation, conversations}) => {
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentification.account.authorities,
        [AUTHORITIES.ADMIN]));
    return <View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => (
                <ChatItem item={item} navigation={navigation}/>
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

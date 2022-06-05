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


const height = Dimensions.get('screen').height;

export default function MessagesScreen({navigation, twilioClient}: TwilioProps) {
    const loginSuccess = useAppSelector(state => state.authentification.loginSuccess);
    const unreadmessageCount = useAppSelector(state => state.messages.unreadMessagesCount);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        console.log("twilioClient outif", twilioClient?.version);
        if (twilioClient) {
            console.log("twilioClient inif", twilioClient.version);
            const initConversations = async () => {
                const cons = await twilioClient.getSubscribedConversations();
                setConversations(cons.items);

                twilioClient.on("conversationAdded", async (conversation: Conversation) => {
                    conversation.on("typingStarted", (participant) => {
                        // handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, startTyping), addNotifications);
                    });

                    conversation.on("typingEnded", (participant) => {
                        // handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, endTyping), addNotifications);
                    });
                    console.log("New conversation", conversation.friendlyName);
                    setConversations(oldConversations => [conversation, ...oldConversations]);
                    conversation.setAllMessagesUnread();
                    if (conversation.uniqueName.includes("GROUPE")) {
                        console.log("GROUPE", conversation.uniqueName);

                    }
                });
                twilioClient.on("conversationRemoved", (conversation: Conversation) => {

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
                        children={() => <Discussion navigation={navigation} conversations={conversations}/>}/>
            <Tab.Screen name="Groupes"
                        options={{
                            tabBarLabel: () => <View style={styles.tabItem}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Groupes</Text>
                            </View>
                        }}
                        children={() => <Groupes navigation={navigation} conversations={conversations}/>}/>

        </Tab.Navigator>

    );
}

const Discussion = ({navigation, conversations}: {
    conversations?: Conversation[];
    navigation?: any;
}) => {
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

    return (<View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => (
                <ChatItem item={item} navigation={navigation}/>
            )}
            keyExtractor={item => item.sid}
        />
        <NewConversation navigation={navigation}/>
    </View>)
}


const Groupes = ({navigation, conversations}) => {
    return <View style={styles.container}>
        <Text style={styles.title}>{navigation.state}</Text>
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

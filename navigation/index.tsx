/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import {
    AddMessagesType,
    ChatParamList,
    InputPhoneParamList,
    ProductParamList,
    SetUreadMessagesType,
    UserListParamList,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import MessagesScreen from "../screens/MessagesScreen";
import ProfilScreen from "../screens/ProfilScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import TermsConditionsScreen from "../screens/registration/TermsConditionsScreen";
import InputPhoneNumberScreen from "../screens/registration/InputPhoneNumberScreen";
import VerifyCodeScreen from "../screens/registration/VerifyCodeScreen";
import RegisterScreen from "../screens/registration/RegisterScreen";
import {createStackNavigator} from "@react-navigation/stack";
import ChatScreen from "../screens/ChatScreen";
import Colors from "../constants/Colors";
import ProductDetail from "../screens/ProductDetail";
import {useAppDispatch, useAppSelector} from '../api/store';
import {
    getOnBoarding,
    getSession,
    getTwilioToken,
    onRefreshSuccess,
    refreshTwilioToken
} from "../api/authentification/authentication.reducer";
import {Client, Conversation, Message, Participant} from "@twilio/conversations";
import {hasAnyAuthority} from "../components/PrivateRoute";
import {AUTHORITIES} from "../constants/constants";
import AddOrModifyProductScreen from "../screens/admin/AddOrModifyProductScreen";
import SearchHidableBar from "../components/SearchHidableBar";
import UserListScreen from "../screens/UserListScreen";
import {Text} from "../components/Themed";
import ConversationProfileSreen from "../screens/ConversationProfileSreen";
import Toast from "react-native-toast-message";
import {handlePromiseRejection, SetParticipantsType, updateConvoList, updateTypingIndicator} from "../shared/helpers";
import {addNotifications} from "../api/notification/notification.reducer";
import {endTyping, startTyping} from "../api/typing-data/typing-data.reducer";
import {getConversationParticipants} from "../api/reducer.utils";
import {updateParticipants} from "../api/participants/participants.reducer";
import {listConversations, removeConversation} from "../api/convos/convos.reducer";
import {addMessages, removeMessages} from "../api/message-list/message-list.reducer";
import {updateUnreadMessages} from "../api/unread-message/unread-messages.reducer";
import {updateCurrentConversation} from "../api/current-conv/current-conv.reducer";

export default function Navigation({colorScheme}) {
    const notifications = useAppSelector(state => state.notifications);
    useEffect(() => {
        if (!notifications.length) {
            return;
        }
        notifications.forEach(notification =>
            Toast.show({
                type: notification.type,
                text1: notification.title,
                position: 'bottom',
                text2: notification.message
            })
        );

    }, [notifications]);
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator/>
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
// const Stack = createNativeStackNavigator<RootStackParamList>();
const Stack = createStackNavigator();
const MsgStack = createStackNavigator<ChatParamList>();
const UserList = createStackNavigator<UserListParamList>();
const ProductStack = createStackNavigator<ProductParamList>();
const InputPhoneStack = createStackNavigator<InputPhoneParamList>();

function RootNavigator() {
    const account = useAppSelector(state => state.authentification.account);
    const onBoardingFinish = useAppSelector(state => state.authentification.onBoardingFinish);
    const refreshSuccess = useAppSelector(state => state.authentification.refreshSuccess);
    const isAuthenticated = useAppSelector(state => state.authentification.isAuthenticated);
    const twilioToken = useAppSelector(state => state.authentification.twilioToken);
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentification.account.authorities, [AUTHORITIES.ADMIN]));

    const dispatch = useAppDispatch();
    const [twilioClient, setTwilioClient] = useState(null);

    function refreshingTwilioToken() {
        twilioClient?.removeAllListeners();
        if (!refreshSuccess) {
            dispatch(refreshTwilioToken({
                phoneNumber: account.phoneNumber,
                token: 'not needed',
                locale: 'fr',
                langKey: 'fr'
            }))
        } else {
            dispatch(onRefreshSuccess());
        }
    }

    useEffect(() => {
        dispatch(getTwilioToken());
        if (twilioToken) {
            // const client = new Client(twilioToken, {logLevel: "debug"}).on('stateChanged', (state) => {
            const client = new Client(twilioToken).addListener('stateChanged', (state) => {
                console.log("stateChanged", state);
                if (state === 'initialized') {
                    setTwilioClient(client);

                    client.addListener("conversationAdded", async (conversation: Conversation) => {
                        conversation.addListener("typingStarted", (participant) => {
                            handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, client.user, startTyping), addNotifications);
                        });

                        conversation.addListener("typingEnded", (participant) => {
                            handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, client.user, endTyping), addNotifications);
                        });

                        handlePromiseRejection(async () => {
                            if (conversation.status === "joined") {
                                console.log("conversationJoined", conversation.sid);
                                const result = await getConversationParticipants(conversation);
                                dispatch(updateParticipants(
                                    {
                                        channelSid: conversation.sid,
                                        participants: result
                                    }
                                ));
                            }
                            updateConvoList(
                                client,
                                conversation,
                                listConversations,
                                addMessages,
                                updateUnreadMessages
                            );
                        }, addNotifications);

                    });
                    client.addListener("conversationRemoved", (conversation: Conversation) => {
                        console.log("conversationRemoved")
                        dispatch(updateCurrentConversation(""));
                        handlePromiseRejection(() => {
                            dispatch(removeConversation(conversation.sid));
                            dispatch(updateParticipants(
                                {
                                    channelSid: conversation.sid,
                                    participants: []
                                }
                            ));
                        }, addNotifications);
                    });
                    client.addListener("messageAdded", (event: Message) => {
                        console.log("Message", event.sid)
                        addMessage(event, addMessages, updateUnreadMessages);
                    });

                    client.addListener("participantLeft", (participant) => {
                        handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
                    });
                    client.addListener("participantUpdated", (event) => {
                        handlePromiseRejection(() => handleParticipantsUpdate(event.participant, updateParticipants), addNotifications);
                    });
                    client.addListener("participantJoined", (participant) => {
                        handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
                    });


                    client.addListener("conversationUpdated", ({conversation, updateReasons}) => {
                        console.log("conversationUpdated status", conversation.status);
                        console.log("updateReasons status", updateReasons);
                        handlePromiseRejection(() => updateConvoList(
                            client,
                            conversation,
                            listConversations,
                            addMessages,
                            updateUnreadMessages
                        ), addNotifications);
                    });

                    client.addListener("messageUpdated", ({message}) => {
                        handlePromiseRejection(() => updateConvoList(
                            client,
                            message.conversation,
                            listConversations,
                            addMessages,
                            updateUnreadMessages
                        ), addNotifications);
                    });

                    client.addListener("messageRemoved", (message) => {
                        handlePromiseRejection(() => dispatch(removeMessages(
                            {
                                channelSid: message.conversation.sid,
                                messageSid: [message]
                            }
                        )), addNotifications);
                    });

                    client.addListener("tokenExpired", () => {
                        console.log("Token expired");
                        refreshingTwilioToken();
                    });
                }

                if (state === 'failed') {
                    refreshingTwilioToken();
                }
            });
        }
        return () => {
            twilioClient?.removeAllListeners();
        }
    }, [isAuthenticated, refreshSuccess]);

    async function handleParticipantsUpdate(
        participant: Participant,
        updateParticipants: SetParticipantsType
    ) {
        const result = await getConversationParticipants(participant.conversation);
        dispatch(updateParticipants({
            channelSid: participant.conversation.sid,
            participants: result
        }));
    }



    function addMessage(
        message: Message,
        addMessages: AddMessagesType,
        updateUnreadMessages: SetUreadMessagesType,
    ) {
        //transform the message and add it to redux
        handlePromiseRejection(() => {
            /*            if (sidRef.current === message.conversation.sid) {
                            message.conversation.updateLastReadMessageIndex(message.index);
                        }*/
            dispatch(addMessages({
                channelSid: message.conversation.sid,
                messages: [message]
            }));
            loadUnreadMessagesCount(message.conversation, updateUnreadMessages);
        }, addNotifications);
    }

    async function loadUnreadMessagesCount(
        convo: Conversation,
        updateUnreadMessages: SetUreadMessagesType
    ) {
        const count = await convo.getUnreadMessagesCount();
        dispatch(updateUnreadMessages(
            {
                channelUniqId: convo.sid,
                unreadCount: count ?? 0
            }
        ));
    }


    useEffect(() => {
        dispatch(getSession());
        dispatch(getOnBoarding());
    }, []);

    const gotToConvProfil = (sid: string, navigation) => {
        navigation.navigate("ConversationProfile", {
            clickedConversation: {
                sid
            }
        });
    };
    return (
        onBoardingFinish ?
            account?.firstName && account?.lastName && account?.email ?
                /* HOME ROOT*/
                <Stack.Navigator>
                    <Stack.Screen name="Root" options={{headerShown: false}}>
                        {props => <BottomTabNavigator twilioClient={twilioClient} {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
                    <UserList.Screen name="UserList" component={UserListScreen} options={({route}) => ({
                        title: route.params.title,
                        headerBackTitle: 'Messages'
                    })}/>
                    <MsgStack.Screen name="ConversationProfile"
                                     options={({route}) => ({
                                         sid: route.params.clickedConversation.sid,
                                         title: '',
                                         headerBackTitle: 'Messages'
                                     })}>
                        {props => <ConversationProfileSreen twilioClient={twilioClient} {...props} />}
                    </MsgStack.Screen>
                    <Stack.Group screenOptions={{presentation: 'modal'}}>
                        <Stack.Screen name="Modal" component={ModalScreen}/>
                    </Stack.Group>
                    <MsgStack.Screen name="Chat"
                                     options={({route, navigation}) => ({
                                         headerTitle: () =>
                                             <Pressable
                                                 onPress={() => gotToConvProfil(route.params.clickedConversation.sid, navigation)}>
                                                 <Text>{route.params.clickedConversation.name}</Text>
                                             </Pressable>,
                                         headerBackTitle: 'Messages'
                                     })}>
                        {props => <ChatScreen twilioClient={twilioClient} {...props} />}
                    </MsgStack.Screen>
                    <ProductStack.Screen name="ProductDetail" component={ProductDetail}
                                         options={({route}) => ({
                                             title: route.params.product.title,
                                             headerBackTitle: route.params.backScreenName
                                         })}
                    />
                    {isAdmin && <ProductStack.Screen name="ProductEdit" component={AddOrModifyProductScreen}
                                                     options={({route}) => ({
                                                         title: route.params.product.title,
                                                         headerBackTitle: route.params.backScreenName
                                                     })}
                    />}
                </Stack.Navigator>
                :
                account?.login ?
                    /* Register */
                    <Stack.Navigator screenOptions={{}}>
                        <Stack.Screen
                            options={{
                                headerShadowVisible: false,
                                headerStyle: {backgroundColor: 'white'},
                                headerTitle: ''
                            }}
                            name="Register" children={() => {
                            return (
                                <RegisterScreen/>
                            )
                        }}/>
                    </Stack.Navigator>
                    :
                    /* InputPhone && VerifyCode */
                    <Stack.Navigator screenOptions={{}}>
                        <Stack.Screen options={{headerShown: false}} name="Terms" component={TermsConditionsScreen}/>
                        <Stack.Screen
                            options={{
                                headerShadowVisible: false,
                                headerStyle: {backgroundColor: 'white'},
                                headerTitle: ''
                            }}
                            name="InputPhone" component={InputPhoneNumberScreen}/>
                        <InputPhoneStack.Screen
                            options={{
                                headerShadowVisible: false,
                                headerStyle: {backgroundColor: 'white'},
                                headerTitle: ''
                            }}
                            name="VerifyCode" component={VerifyCodeScreen}/>

                    </Stack.Navigator>

            : <OnBoardingScreen/>
    );
}


const getRightView = (onChangeSearch) => {
    return <View style={{flexDirection: 'row'}}>

        <SearchHidableBar onChangeSearch={onChangeSearch} value={''}/>
        <Pressable
            onPress={() => {
            }}
            style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
            })}>
            <MaterialIcons
                name="more-vert"
                size={25}
                color="grey"
                style={{marginRight: 15, fontWeight: 'bold'}}
            />
        </Pressable>
    </View>;
}


/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator();

function BottomTabNavigator({twilioClient}) {
    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10
                },
                tabBarIconStyle: {
                    marginBottom: 3
                },
                tabBarBadgeStyle: {
                    backgroundColor: "#254304"
                },
                tabBarActiveTintColor: Colors.light.sekhmetGreen,

            }}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={({navigation}) => ({
                    title: 'Home',
                    headerShadowVisible: false,

                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
                    headerRight: () => getRightView((search) => console.log('Search', {search})
                    )
                })}
            />
            <BottomTab.Screen
                name="Message"
                options={({route, navigation}) => ({
                    title: 'Messages',
                    tabBarLabelPosition: 'below-icon',
                    tabBarBadge: 5,
                    headerRight: () => getRightView((search) => console.log('Search', {search})),
                    tabBarIcon: ({color}) => <TabBarIcon name="comments" color={color}/>
                })}
            >
                {props => <MessagesScreen twilioClient={twilioClient} {...props} />}
            </BottomTab.Screen>

            <BottomTab.Screen
                name="Notification"
                component={NotificationsScreen}
                options={{
                    title: 'Notifications',
                    tabBarLabelPosition: 'below-icon',
                    tabBarBadge: 1,
                    tabBarIcon: ({color}) => <TabBarIcon name="bell" color={color}/>,
                }}
            />

            <BottomTab.Screen
                name="Profil"
                component={ProfilScreen}
                options={{
                    title: 'Profil',
                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: ({color}) => <TabBarIcon name="user" color={color}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}


/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{marginBottom: -3}} {...props} />;
}

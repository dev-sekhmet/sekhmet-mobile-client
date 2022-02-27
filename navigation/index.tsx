/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {createContext, useEffect, useState} from 'react';
import {Dimensions, Pressable, View} from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import {ChatParamList, InputPhoneParamList, ProductParamList,} from '../types';
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
import {getOnBoarding, getSession, getTwilioToken} from "../api/authentification/authentication.reducer";
import {Searchbar} from 'react-native-paper';
import {onPerformSearchQuery} from "../api/search/search.reducer";
import {Client, Conversation} from "@twilio/conversations";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export const ChatContext = createContext({});

export default function Navigation({colorScheme}) {

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
const ProductStack = createStackNavigator<ProductParamList>();
const InputPhoneStack = createStackNavigator<InputPhoneParamList>();

function RootNavigator() {
    const account = useAppSelector(state => state.authentification.account);
    const onBoardingFinish = useAppSelector(state => state.authentification.onBoardingFinish);
    const twilioToken = useAppSelector(state => state.authentification.twilioToken);
    const dispatch = useAppDispatch();
    const [twilioClient, setTwilioClient] = useState(null);

    useEffect(() => {
        dispatch(getTwilioToken());
        if (twilioToken) {
            // const client = new Client(twilioToken, {logLevel: "debug"}).on('stateChanged', (state) => {
            const client = new Client(twilioToken).on('stateChanged', (state) => {
                console.log("stateChanged", state);
                if (state === 'initialized') {
                    setTwilioClient(client);
                    console.log("Init Good");
                    client.addListener("tokenExpired", () => {
                        console.log("Token expired");
                    });

                    //updateLoadingState(false);
                }
            });
        }
        return () => {
            twilioClient?.removeAllListeners();
        }
    }, [twilioToken]);


    useEffect(() => {
        dispatch(getSession());
        dispatch(getOnBoarding());
    }, []);

    async function updateConvoList(
        client: Client,
        conversation: Conversation,
        setConvos,
        addMessages,
        updateUnreadMessages
    ) {
        if (conversation.status === "joined") {
            const messages = await conversation.getMessages();
            dispatch(addMessages({channelSid: conversation.sid, messages: messages.items}));
        } else {
            dispatch(addMessages({channelSid: conversation.sid, messages: []}));
        }

        loadUnreadMessagesCount(conversation, updateUnreadMessages);

        const subscribedConversations = await client.getSubscribedConversations();
        dispatch(setConvos(subscribedConversations.items));
    }

    async function loadUnreadMessagesCount(
        convo: Conversation,
        updateUnreadMessages
    ) {
        const count = await convo.getUnreadMessagesCount();
        dispatch(updateUnreadMessages({channelSid: convo.sid, unreadCount: count ?? 0}));
    }

    return (
        onBoardingFinish ?
            account?.firstName && account?.lastName && account?.email ?
                /* HOME ROOT*/
                <Stack.Navigator>
                    <Stack.Screen name="Root" options={{headerShown: false}}>
                        {props => <BottomTabNavigator twilioClient={twilioClient} {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
                    <Stack.Group screenOptions={{presentation: 'modal'}}>
                        <Stack.Screen name="Modal" component={ModalScreen}/>
                    </Stack.Group>
                    <MsgStack.Screen name="Chat"
                                     options={({route}) => ({
                                         title: route.params.clickedConversation.name,
                                         headerBackTitle: 'Messages'
                                     })}
                    >
                        {props => <ChatScreen twilioClient={twilioClient} {...props} />}
                    </MsgStack.Screen>
                    <ProductStack.Screen name="ProductDetail" component={ProductDetail}
                                         options={({route}) => ({
                                             title: route.params.product.title,
                                             headerBackTitle: route.params.backScreenName
                                         })}
                    />
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

const getRightView = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showInputSearch, setShowInputSearch] = useState(false);
    const dispatch = useAppDispatch();
    const onChangeSearch = query => {
        setSearchQuery(query);
        dispatch(onPerformSearchQuery(query))
    };

    useEffect(() => {
        return () => {
            setShowInputSearch(false)
        };
    }, []);

    return <View style={{flexDirection: 'row'}}>
        {showInputSearch && <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            autoFocus={true}
            onBlur={() => setShowInputSearch(false)}
            style={{width: width * 0.8, height: 40}}
        />}
        {!showInputSearch && <Pressable
            onPress={() => setShowInputSearch(true)}
            style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
                name="search"
                size={25}
                color="grey"
                style={{marginRight: 15, fontWeight: 'bold'}}
            />
        </Pressable>}

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
    const colorScheme = useColorScheme();

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
                    headerRight: () => getRightView({navigation})
                })}
            />
            <BottomTab.Screen
                name="Message"
                options={({route, navigation}) => ({
                    title: 'Messages',
                    tabBarLabelPosition: 'below-icon',
                    tabBarBadge: 5,
                    headerRight: () => getRightView({navigation}),
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

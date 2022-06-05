import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import ChatItem from "../components/ChatItem";
import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import {Badge, FAB} from "react-native-elements";
import {useAppDispatch, useAppSelector} from "../api/store";
import {Conversation} from "@twilio/conversations";
import {TwilioProps} from "../types";
import {getUsers} from "../api/user-management/user-management.reducer";
import {IUser} from "../model/user.model";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import UserItem from "../components/UserItem";
import {findOrCreateConversationDual} from "../api/conversation-write/conversation-write.reducer";
import {reset} from "../api/settings/settings.reducer";
import {getFriendlyName} from "../shared/conversation/conversation.util";
import SearchHidableBar from "../components/SearchHidableBar";


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
        {getListUsersModal(navigation)}
    </View>)
}


const getListUsersModal = (navigation) => {
    const dispatch = useAppDispatch();
    const users = useAppSelector<ReadonlyArray<IUser>>(state => state.userManagement.users);
    const [searchvaluealue, setSearchvaluealue] = useState('');
    const account = useAppSelector(state => state.authentification.account);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const selectedConversation = useAppSelector<Conversation>(state => state.conversationWrite.selectedConversation);
    const [pagination, setPagination] = useState<{ activePage: number, order: string, sort: string }>({
        activePage: 0,
        sort: 'id',
        order: 'DESC'
    });
    const snapPoints = useMemo(() => ['100%', '80%'], []);


    useEffect(() => {
        if (selectedConversation) {
            console.log("selectedConversation", selectedConversation.attributes);
            navigation.navigate("Chat", {
                clickedConversation: {
                    sid: selectedConversation.sid,
                    name: getFriendlyName(selectedConversation, account)
                }
            });
        }
    }, [selectedConversation]);

    useEffect(() => {
        onChangeSearch('');
    }, []);

    const openUsers = () => {
        console.log("val openUsers");
        bottomSheetModalRef.current.present();
    }

    const onChangeSearch = (searchQuery) => {
        setSearchvaluealue(searchQuery);
        dispatch(
            getUsers({
                page: pagination.activePage,
                size: 10,
                sort: `${pagination.sort},${pagination.order}`,
                search: searchQuery ? searchQuery : ''
            }));
    }

    const selectedUser = (user: IUser) => {
        bottomSheetModalRef.current.close();
        dispatch(findOrCreateConversationDual(user.id));
    }

    const usersWithoutMe = users.filter(user => user.id.toLowerCase() !== account.id.toLowerCase());
    return <>
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 11,
                },
                shadowOpacity: 0.57,
                shadowRadius: 15.19,

                elevation: 23
            }}
            snapPoints={snapPoints}>

            <View style={{
                alignItems: 'center',
            }}>
                <SearchHidableBar onChangeSearch={onChangeSearch} value={searchvaluealue}/>
            </View>
            <FlatList
                data={usersWithoutMe}
                renderItem={({item}) => (
                    <UserItem item={item} selectedUser={selectedUser}/>
                )}
                keyExtractor={item => item.id}
            />
        </BottomSheetModal>
        <FAB
            style={styles.fab}
            size="small"
            color={Colors.light.sekhmetOrange}
            title={"Nouvelle discussion"}
            icon={{name: "comment", color: "white"}}
            onPress={() => openUsers()}
        />
    </>
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
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

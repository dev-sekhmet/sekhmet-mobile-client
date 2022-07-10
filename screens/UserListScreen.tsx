import {TwilioProps} from "../types";
import {useAppDispatch, useAppSelector} from "../api/store";
import React, {useEffect, useState} from "react";
import {Conversation, Message, Paginator} from "@twilio/conversations";
import {Text, View} from "../components/Themed";
import {Icon, ListItem, Switch} from "react-native-elements";
import UserItem from "../components/UserItem";
import {FlatList, Pressable} from "react-native";
import {IUser} from "../model/user.model";
import {CONVERSATION_TYPE} from "../constants/constants";
import {findOrCreateConversationDual} from "../api/conversation-write/conversation-write.reducer";
import {getFriendlyName} from "../shared/conversation/conversation.util";
import {getUsers} from "../api/user-management/user-management.reducer";
import {NewConversationParam} from "../components/NewConversation";
import SearchHidableBar from "../components/SearchHidableBar";
import Colors from "../constants/Colors";

export default function UserListScreen({navigation, route}) {
    const dispatch = useAppDispatch();
    const users = useAppSelector<ReadonlyArray<IUser>>(state => state.userManagement.users);
    const [searchValue, setSearchValue] = useState('');
    const account = useAppSelector(state => state.authentification.account);
    const selectedConversation = useAppSelector<Conversation>(state => state.conversationWrite.selectedConversation);
    const [pagination, setPagination] = useState<{ activePage: number, order: string, sort: string }>({
        activePage: 0,
        sort: 'id',
        order: 'DESC'
    });

    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);


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

    const onChangeSearch = (searchQuery) => {
        setSearchValue(searchQuery);
        dispatch(
            getUsers({
                page: pagination.activePage,
                size: 10,
                sort: `${pagination.sort},${pagination.order}`,
                search: searchQuery ? searchQuery : ''
            }));
    }

    const selectedUser = (user: IUser, isSelected) => {
        if ( route.params.conversationInfo.type === CONVERSATION_TYPE.DUAL) {
            dispatch(findOrCreateConversationDual(user.id));
        } else {
            console.log("selectedUser", selectedUsers.length);
            setSelectedUsers(isSelected ?
                [...selectedUsers, user] : selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        }
    }

    const createGroup = () => {
        if (selectedUsers.length > 0) {
            //dispatch(findOrCreateConversationGroup(selectedUsers.map(user => user.id)));
        }
    }


    let usersWithoutMe = [];
    if (users) {
        usersWithoutMe = users.filter(user => user.id.toLowerCase() !== account.id.toLowerCase());
    }

    return <View><Text>CreateDualOrGroup</Text>
        <View>
            <SearchHidableBar onChangeSearch={onChangeSearch} value={searchValue}/>
            <Pressable onPress={createGroup} style={{
                alignItems: 'flex-end',
            }}>
                <Text style={{color: Colors.light.sekhmetGreen}}>Terminer</Text>
            </Pressable>
        </View>
        <FlatList
            data={usersWithoutMe}
            renderItem={({item}) => (
                <UserItem
                    item={item}
                    execSelection={selectedUser}
                    creationType={route.params.conversationInfo.type}
                    isUserSelected={selectedUsers.some(selectedUser => selectedUser.id === item.id)}
                />
            )}
            keyExtractor={item => item.id}
        />
    </View>;
}

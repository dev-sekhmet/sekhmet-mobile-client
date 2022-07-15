import {useAppDispatch, useAppSelector} from "../api/store";
import React, {useEffect, useState} from "react";
import {Conversation} from "@twilio/conversations";
import {View} from "../components/Themed";
import UserItem from "../components/UserItem";
import {FlatList, StyleSheet, TextInput} from "react-native";
import {IUser} from "../model/user.model";
import {AUTHORITIES, CONVERSATION_TYPE} from "../constants/constants";
import {
    findOrCreateConversation,
    reset
} from "../api/conversation-write/conversation-write.reducer";
import {getFriendlyName} from "../shared/conversation/conversation.util";
import {getUsers} from "../api/user-management/user-management.reducer";
import Colors from "../constants/Colors";
import {FAB} from "react-native-elements";
import {hasAnyAuthority} from "../components/PrivateRoute";

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
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentification.account.authorities,
        [AUTHORITIES.ADMIN]));

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

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
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
        if (route.params.conversationInfo.type === CONVERSATION_TYPE.DUAL) {
            console.log("selectedUser", user);
            dispatch(findOrCreateConversation({
                ids: [user.id],
                friendlyName: "testDualGO",
                description: "testDualDescriptionGO",
            }));
        } else {
            console.log("selectedUser", selectedUsers.length);
            setSelectedUsers(isSelected ?
                [...selectedUsers, user] : selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        }
    }

    const isValidUserNumber = () =>{
        return selectedUsers.length >= 2;
    }

    const createGroup = () => {
        if (isValidUserNumber()) {
            dispatch(findOrCreateConversation({
                ids: selectedUsers.map(user => user.id),
                friendlyName: "testGROUPGO",
                description: "testDescriptionGROUPGO",
            }));
        }
    }


    let usersWithoutMe = [];
    if (users) {
        usersWithoutMe = users.filter(user => user.id.toLowerCase() !== account.id.toLowerCase());
    }

    const canCreateGroup = isAdmin && route.params.conversationInfo.type === CONVERSATION_TYPE.GROUP;
    return <View style={[styles.view, {marginTop: 15}]}>
        <TextInput
            style={styles.inputText}
            placeholder={'Taper le nom ou le numéro'}
            onChangeText={onChangeSearch}
            value={searchValue}
        />
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
        {canCreateGroup &&  <FAB
            style={styles.fab}
            size="small"
            disabled={!isValidUserNumber()}
            color={Colors.light.sekhmetOrange}
            title={"Suivant"}
            icon={{name: "comment", color: "white"}}
            onPress={createGroup}
        />}
    </View>;
}

const styles = StyleSheet.create({
    inputText: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 3,
        paddingHorizontal: 8
    },
    view: {marginRight: 20, marginLeft: 20, marginTop: 20, flexDirection: "column", height: "100%"},
    fab: {
        position: 'absolute',
        margin: 16,
        right: 95,
        bottom: 50,
    }
});
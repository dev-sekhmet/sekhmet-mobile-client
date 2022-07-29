import {useAppDispatch, useAppSelector} from "../api/store";
import React, {useEffect, useState} from "react";
import {Conversation} from "@twilio/conversations";
import {View} from "../components/Themed";
import UserItem from "../components/UserItem";
import {Alert, FlatList, StyleSheet, TextInput} from "react-native";
import {IUser} from "../model/user.model";
import {AUTHORITIES, CONVERSATION_TYPE} from "../constants/constants";
import {findOrCreateConversation, reset} from "../api/conversation-write/conversation-write.reducer";
import {getUsers} from "../api/user-management/user-management.reducer";
import Colors from "../constants/Colors";
import {FAB} from "react-native-elements";
import {hasAnyAuthority} from "../components/PrivateRoute";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";

export default function UserListScreen({navigation, route}) {
    const dispatch = useAppDispatch();
    const users = useAppSelector<ReadonlyArray<IUser>>(state => state.userManagement.users);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const account = useAppSelector(state => state.authentification.account);
    const conversations = useAppSelector(state => state.convos);
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
            setLoading(false);
            navigation.goBack()
            dispatch(reset());
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
            setLoading(true);
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

    const isValidUserNumber = () => {
        return selectedUsers.length >= 2;
    }

    const createGroup = (groupName: string) => {
        if (!groupName) {
            enterGroupName();
            return;
        }
        if (isValidUserNumber()) {
            setLoading(true);
            dispatch(findOrCreateConversation({
                ids: selectedUsers.map(user => user.id),
                friendlyName: groupName,
                description: "",
            }));
        }
    }

    const enterGroupName = () => {
        Alert.prompt(
            "Nom du groupe",
            "Entrer un nom pour le groupe",
            [
                {
                    text: "Créer le groupe",
                    onPress: (groupName) => createGroup(groupName),
                    style: "destructive",
                },
                {
                    text: "Cancel",
                },
            ],
            "plain-text",
        );
    };


    let usersWithoutMe = [];
    if (users) {
        usersWithoutMe = users.filter(user => user.id.toLowerCase() !== account.id.toLowerCase());
    }
    if (loading) {
        return <SekhmetActivityIndicator/>;
    }

    const canCreateGroup = isAdmin && route.params.conversationInfo.type === CONVERSATION_TYPE.GROUP;
    return <View>
        <View style={[styles.view, {marginTop: 15}]}>
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
            {canCreateGroup && <FAB
                style={styles.fab}
                size="small"
                disabled={!isValidUserNumber()}
                color={Colors.light.sekhmetOrange}
                title={"Suivant"}
                icon={{name: "comment", color: "white"}}
                onPress={enterGroupName}
            />}
        </View>
    </View>;
}

const styles = StyleSheet.create({
    inputText: {
        height: 40,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        marginBottom: 10,
        fontSize: 16,
    },
    view: {marginRight: 20, marginLeft: 20, marginTop: 20, flexDirection: "column", height: "100%"},
    fab: {
        position: 'absolute',
        margin: 16,
        right: 95,
        bottom: 50,
    }
});
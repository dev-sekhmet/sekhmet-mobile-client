import {useAppDispatch, useAppSelector} from "../../api/store";
import React, {useEffect, useState} from "react";
import {Conversation, JSONObject, JSONValue} from "@twilio/conversations";
import {View} from "../../components/Themed";
import UserItem from "../../components/UserItem";
import {FlatList, StyleSheet, TextInput} from "react-native";
import {IUser} from "../../model/user.model";
import {AUTHORITIES, TWILIO_ROLE} from "../../constants/constants";
import {reset} from "../../api/conversation-write/conversation-write.reducer";
import {getUsers} from "../../api/user-management/user-management.reducer";
import Colors from "../../constants/Colors";
import {FAB} from "react-native-elements";
import {hasAnyAuthority} from "../../components/PrivateRoute";
import SekhmetActivityIndicator from "../../components/SekhmetActivityIndicator";
import {forkJoin, from} from "rxjs";

export default function ConversationAddParticipantsScreen({navigation, route}) {
    const dispatch = useAppDispatch();
    const users = useAppSelector<ReadonlyArray<IUser>>(state => state.userManagement.users);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const account = useAppSelector(state => state.authentification.account);
    const conversations = useAppSelector(state => state.convos);
    const [conversation, setConversation] = useState<Conversation>(conversations.find(c => c.sid === route.params.sid));
    const [pagination, setPagination] = useState<{ activePage: number, order: string, sort: string }>({
        activePage: 0,
        sort: 'id',
        order: 'DESC'
    });
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentification.account.authorities,
        [AUTHORITIES.ADMIN]));

    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);


    useEffect(() => {
        onChangeSearch('');
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
        setSelectedUsers(isSelected ?
            [...selectedUsers, user] : selectedUsers.filter(selectedUser => selectedUser.id !== user.id));

    }

    const isValidUserNumber = () => {
        return selectedUsers.length >= 1;
    }

    const addParticipants = () => {
        console.log(selectedUsers.length);
        console.log(selectedUsers);
        const allFutures = selectedUsers.map(user => {
            return from(conversation.add(user.id, {
                participant:{
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.lastName,
                },
                role: TWILIO_ROLE.CHANNEL_USER
            }));
        });

        forkJoin(allFutures).subscribe((all) => {
            console.log('all done', all.length);
            console.log('PART ATTRIBUTES: ', all[0].attributes);
            navigation.goBack();
        });
    };

    if (loading) {
        return <SekhmetActivityIndicator/>;
    }
    let usersWithoutMe = [];
    if (users) {
        usersWithoutMe = users.filter(user => user.id.toLowerCase() !== account.id.toLowerCase());
    }
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
                        user={item}
                        execSelection={selectedUser}
                        isUserSelected={selectedUsers.some(selectedUser => selectedUser.id === item.id)}
                    />
                )}
                keyExtractor={item => item.id}/>

            <FAB
                style={styles.fab}
                size="small"
                disabled={!isValidUserNumber()}
                color={Colors.light.sekhmetOrange}
                title={"Ajouter"}
                icon={{name: "comment", color: "white"}}
                onPress={addParticipants}/>
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
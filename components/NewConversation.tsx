import {getUsers} from "../api/user-management/user-management.reducer";
import {IUser} from "../model/user.model";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import UserItem from "../components/UserItem";
import {findOrCreateConversationDual} from "../api/conversation-write/conversation-write.reducer";
import {getFriendlyName} from "../shared/conversation/conversation.util";
import SearchHidableBar from "../components/SearchHidableBar";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../api/store";
import {Conversation} from "@twilio/conversations";
import {FlatList, StyleSheet} from 'react-native';
import {FAB} from "react-native-elements";
import {View} from './Themed';
import Colors from "../constants/Colors";

const NewConversation = ({navigation, buttonLabel}) => {
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

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
        bottomSheetModalRef.current?.forceClose();
    }, []);

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
    let usersWithoutMe = [];
    if (users) {
        usersWithoutMe = users.filter(user => user.id.toLowerCase() !== account.id.toLowerCase());
    }
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
            onChange={handleSheetChanges}
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
            title={buttonLabel}
            icon={{name: "comment", color: "white"}}
            onPress={() => handlePresentModalPress()}
        />
    </>
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});

export default NewConversation;
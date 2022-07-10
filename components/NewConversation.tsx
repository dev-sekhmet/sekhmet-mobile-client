import React from "react";
import {StyleSheet} from 'react-native';
import {FAB} from "react-native-elements";
import Colors from "../constants/Colors";
import {CONVERSATION_TYPE} from "../constants/constants";

export type NewConversationParam = { navigation?: any, route?: any, conversationInfo: { label: string, type: CONVERSATION_TYPE } };
const NewConversation = ({
                             navigation,
                             conversationInfo
                         }: NewConversationParam) => {
    const openUserList = () => {
        navigation.navigate("UserList", {
            title: conversationInfo.label,
            conversationInfo
        });
    }

    return <>
        <FAB
            style={styles.fab}
            size="small"
            color={Colors.light.sekhmetOrange}
            title={conversationInfo.label}
            icon={{name: "comment", color: "white"}}
            onPress={() => openUserList()}
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
import {CheckBox, ListItem} from "react-native-elements";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {IUser} from "../model/user.model";
import ProfilAvatar from "./ProfilAvatar";
import {CONVERSATION_TYPE} from "../constants/constants";


export default function UserItem({item, execSelection, creationType, isUserSelected}:
                                     {
                                         creationType: CONVERSATION_TYPE,
                                         item: IUser,
                                         execSelection: (user: IUser, isSelected: boolean) => void,
                                         isUserSelected: boolean
                                     }) {

    return (
        <ListItem
            key={item.id}
            onPress={() => {
                execSelection(item, !isUserSelected);
            }}>
            {(creationType === CONVERSATION_TYPE.GROUP) &&
                <CheckBox
                    checked={isUserSelected}
                    checkedColor={Colors.light.sekhmetGreen}
                />
            }
            <ProfilAvatar
                size={30}
                key={item?.imageUrl}
                title={item?.firstName?.charAt(0)}
                imageUrl={item?.imageUrl}
            />
            <ListItem.Content>
                <ListItem.Title>{`${item?.firstName} ${item?.lastName}`}</ListItem.Title>
            </ListItem.Content>
        </ListItem>

    );
}
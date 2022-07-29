import {CheckBox, Icon, ListItem} from "react-native-elements";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {IUser} from "../model/user.model";
import ProfilAvatar from "./ProfilAvatar";
import {CONVERSATION_TYPE} from "../constants/constants";
import {View} from "./Themed";


export default function UserItem({item, execSelection, creationType, isUserSelected}:
                                     {
                                         creationType: CONVERSATION_TYPE,
                                         item: IUser,
                                         execSelection: (user: IUser, isSelected: boolean) => void,
                                         isUserSelected: boolean
                                     }) {

    return (
        <ListItem
            bottomDivider
            key={item.id}
            containerStyle={{backgroundColor: isUserSelected ? '#F6FFEC' : 'white'}}
            onPress={() => {
                execSelection(item, !isUserSelected);
            }}>

            <ProfilAvatar
                size={30}
                key={item?.imageUrl}
                title={item?.firstName?.charAt(0)}
                imageUrl={item?.imageUrl}/>

            <ListItem.Content>
                {isUserSelected &&
                    <Icon
                        color={item?.imageUrl? 'white' : 'black'}
                        tvParallaxProperties={{enabled: false}}
                        containerStyle={{ position: 'absolute', left: -40, top: 0 }}
                        name="check" size={20}/>}
                <ListItem.Title>{`${item?.firstName} ${item?.lastName}`}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
}
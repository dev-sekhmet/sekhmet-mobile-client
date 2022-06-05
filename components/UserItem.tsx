import {StyleSheet,} from 'react-native';
import {Text, View} from './Themed';
import {Avatar, Badge, CheckBox, Icon, ListItem, Switch} from "react-native-elements";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {IUser} from "../model/user.model";
import ProfilAvatar from "./ProfilAvatar";


export default function UserItem({item, selectedUser}: { item: IUser, selectedUser: (user: IUser) => void }) {
      return (
            <ListItem

                onPress={()=>selectedUser(item)}>
                <ProfilAvatar
                    size={30}
                    key={item.imageUrl}
                    title={item.firstName.charAt(0)}
                    imageUrl={item.imageUrl}
                />
                <ListItem.Content>
                    <ListItem.Title>{`${item?.firstName} ${item?.lastName}`}</ListItem.Title>
                </ListItem.Content>
            </ListItem>

    );
}
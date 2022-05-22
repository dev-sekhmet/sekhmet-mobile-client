import {StyleSheet,} from 'react-native';
import {Text, View} from './Themed';
import {Avatar, Badge, CheckBox, Icon, ListItem, Switch} from "react-native-elements";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {IUser} from "../model/user.model";
import ProfilAvatar from "./ProfilAvatar";


export default function UserItem({item, selectedUser}: { item: IUser, selectedUser: (user: IUser) => void }) {
    const [isSelected, setSelection] = useState(false);
    const onPress = () => {
        console.log("Press")
    };

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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 30,
        marginRight: 10,
    },
    badgeContainer: {
        backgroundColor: Colors.light.sekhmetOrange,

        borderWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        left: -20,
        top: 40,
    },
    badgeText: {
        color: 'white',
        fontSize: 12
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 3,
    },
    text: {
        color: 'grey',
    }
});

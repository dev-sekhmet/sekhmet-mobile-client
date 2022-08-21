import {Icon, ListItem} from "react-native-elements";
import React from "react";
import {IUser} from "../model/user.model";
import ProfilAvatar from "./ProfilAvatar";
import {CONVERSATION_TYPE, TWILIO_ROLE} from "../constants/constants";
import {useAppSelector} from "../api/store";
import {Text, View} from "./Themed";
import Colors from "../constants/Colors";


export default function UserItem({user, execSelection, isUserSelected}:
                                     {
                                         user: IUser,
                                         execSelection: (user: IUser, isSelected: boolean) => void,
                                         isUserSelected?: boolean
                                     }) {
    const account = useAppSelector(state => state.authentification.account);

    const getUserFullName = () => {
        return account.id === user.id ? 'Vous' : `${user?.firstName} ${user?.lastName}`;
    }

    const getUserRole = () => {
        return user?.twilioRole === TWILIO_ROLE.CHANNEL_ADMIN ? 'Admin' : '';
    }

    return (
        <ListItem
            bottomDivider
            key={user.id}
            containerStyle={{backgroundColor: isUserSelected ? '#F6FFEC' : 'white'}}
            onPress={() => {
                execSelection(user, !isUserSelected);
            }}>

            <ProfilAvatar
                size={30}
                key={user?.imageUrl}
                title={user?.firstName?.charAt(0)}
                imageUrl={user?.imageUrl}/>

            <ListItem.Content>
                {isUserSelected &&
                    <Icon
                        color={user?.imageUrl? 'white' : 'black'}
                        tvParallaxProperties={{enabled: false}}
                        containerStyle={{ position: 'absolute', left: -40, top: 0 }}
                        name="check"
                        size={20}/>
                }
                <ListItem.Title>{getUserFullName()}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title style={{marginLeft: 10, color: Colors.light.sekhmetGreen}}>{getUserRole()}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
}
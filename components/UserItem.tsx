import {Icon, ListItem} from "react-native-elements";
import React from "react";
import {IUser} from "../model/user.model";
import ProfilAvatar from "./ProfilAvatar";
import {CONVERSATION_TYPE, TWILIO_ROLE} from "../constants/constants";
import {useAppSelector} from "../api/store";
import {Text, View} from "./Themed";
import Colors from "../constants/Colors";


export default function UserItem({item, execSelection, creationType, isUserSelected}:
                                     {
                                         creationType: CONVERSATION_TYPE,
                                         item: IUser,
                                         execSelection: (user: IUser, isSelected: boolean) => void,
                                         isUserSelected?: boolean
                                     }) {
    const account = useAppSelector(state => state.authentification.account);

    const getUserFullName = () => {
        return account.id === item.id ? 'Vous' : `${item?.firstName} ${item?.lastName}`;
    }

    const getUserRole = () => {
        return item?.twilioRole === TWILIO_ROLE.CHANNEL_ADMIN ? 'Admin' : '';
    }

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
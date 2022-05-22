import * as React from "react";
import {useEffect, useState} from "react";
import {axiosInstance} from "../api/axios-config";
import {Avatar, Badge} from "react-native-elements";
import {FontAwesome} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "../api/authentification/authentication.reducer";

const ProfilAvatar = (props) => {
    const [token, setToken] = useState('');
    useEffect(() => {
        const initToken = async () => {
            const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
            setToken(token);
        }
        if (token === '') {
            initToken();
        }

    }, [token]);

    return (
        <Avatar
            rounded
            {...props}
            source={{uri: `${axiosInstance.defaults.baseURL}/${props.imageUrl}?access_token=${token}`}}
            containerStyle={{
                borderColor: 'grey',
                borderStyle: 'solid',
                borderWidth: 1,
            }}>
            {props.badge && <Badge
                value={<FontAwesome style={{color: 'white',}} size={10} name="pencil"/>}
                badgeStyle={props.badge.styles}/>

            }
        </Avatar>
    )
}

export default ProfilAvatar;
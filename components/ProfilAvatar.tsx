import * as React from "react";
import {useEffect, useState} from "react";
import {axiosInstance} from "../api/axios-config";
import {Avatar, Badge} from "react-native-elements";
import {FontAwesome} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "../api/authentification/authentication.reducer";
import {StyleSheet} from "react-native";
import Colors from "../constants/Colors";

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
            title={props.title.charAt(0).toUpperCase()}
            source={{uri: props.imageUrl?`${axiosInstance.defaults.baseURL}/${props.imageUrl}?access_token=${token}`:'null'}}
            containerStyle={styles.profilAvatar}>
            {props.badge && <Badge
                value={<FontAwesome style={{color: 'white',}} size={10} name="pencil"/>}
                badgeStyle={props.badge.styles}/>

            }
        </Avatar>
    )
}

const styles = StyleSheet.create({
    profilAvatar: {
        borderColor: 'grey',
        borderStyle: 'solid',
        borderWidth: 1,
    }
});

export default ProfilAvatar;
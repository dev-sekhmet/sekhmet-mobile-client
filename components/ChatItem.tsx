import {Pressable, StyleSheet} from 'react-native';
import {Text, View} from './Themed';
import {Avatar} from "react-native-elements";
import React from "react";
import Colors from "../constants/Colors";
import {Badge} from "react-native-paper";

export default function ChatItem({item, navigation}) {

    const onPress = () => {
        navigation.navigate("Chat", {    clickedChat: {
                id: item.id,
                name: `${item.user.firstName} ${item.user.lastName}`
            } });
    };
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Avatar
                size={60}
                rounded
                source={{uri: 'https://randomuser.me/api/portraits/men/75.jpg'}}
                containerStyle={{
                    borderColor: 'grey',
                    borderStyle: 'solid',
                    borderWidth: 1,
                }}/>

            {item.user.isCoach && <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>C</Text>
            </View>}

            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={styles.name}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
                        <Badge
                            size={8}
                            style={{backgroundColor: Colors.light.online, marginBottom:8, marginLeft:6}}>
                        </Badge>
                    </View>
                    {item.nbUnReadMsgs > 0 &&
                    <Badge
                        style={{backgroundColor: Colors.light.sekhmetGreen}}>
                        {item.nbUnReadMsgs}
                    </Badge>}
                </View>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.text}>
                        {'dernier message ffff'}
                    </Text>
                    <Text style={styles.text}>{item.createdAt}</Text>
                </View>

            </View>
        </Pressable>
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
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 40,
        top: 50,
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

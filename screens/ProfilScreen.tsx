import {ColorValue, Dimensions, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Text, View} from '../components/Themed';
import {Avatar, Icon, ListItem, Switch} from "react-native-elements";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {Menu} from "react-native-paper";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
type MenuItem = {
    title: string;
    icon: string;
    color?: ColorValue | number | undefined;
    notif?: boolean
    type? : 'account' | 'notif' | 'plus'
};
export default function ProfilScreen() {
    // const navigation = useNavigation();

    // const saveData = async () => {
    //     navigation.
    // }


    const [accountItems, setAccountItems] = useState<MenuItem[]>([
        {
            title: 'Mon compte',
            icon: 'person',
            color: Colors.light.sekhmetGreen
        },
        {
            title: 'Mon Adresse',
            icon: 'location-on',
            color: Colors.light.sekhmetGreen
        }
    ]);

    const [notificationItems, setNotificationItems]  = useState<MenuItem[]>( [
        {
            title: 'Push Notification',
            icon: 'notifications',
            color: Colors.light.sekhmetGreen,
            notif: false,
            type: "notif"
        },
        {
            title: 'Notification Promo',
            icon: 'notifications',
            color: Colors.light.sekhmetGreen,
            notif: true,
            type: "notif"
        }
    ]);

    const [plusItems, setPlusItems] = useState<MenuItem[]>([
        {
            title: 'Langue',
            icon: 'language',
            color: Colors.light.sekhmetGreen
        },
        {
            title: 'A propos de sekhmet',
            icon: 'info',
            color: Colors.light.sekhmetGreen
        }
    ]);
    const log = (item) => console.log('this is an example method', item);

    const setChecked = (id: string) => {
        const newList = notificationItems.map((item) => {
            if (item.title === id) {
                const updatedItem : MenuItem= {
                    ...item,
                    notif: !item.notif,
                };

                return updatedItem;
            }

            return item;
        });

        setNotificationItems(newList);
    }

    const renderRow = ({item}: { item: MenuItem }) => {
        return (
            <ListItem
                bottomDivider
                onPress={(value)=>log(value)}
            >
                <Icon color={item.color} name={item.icon}/>
                <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                {!item.type && <ListItem.Chevron/>}
                {item.type && <Switch value={item.notif} onValueChange={(value) => setChecked(item.title)}/>}
            </ListItem>
        );
    };
    return (
        <View style={{backgroundColor: '#eaeaea', flex: 1}}>

            <SafeAreaView>
                <View style={{paddingVertical: 10, alignItems: 'center', backgroundColor: '#eaeaea',}}>
                    <Avatar
                        size={80}
                        rounded
                        source={require("../assets/images/photoprofil.png")}
                        containerStyle={{
                            borderColor: 'grey',
                            borderStyle: 'solid',
                            borderWidth: 1,
                        }}
                    />
                    <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 4, fontSize: 18}}>Brenda
                        Maboma</Text>
                    <Text style={{textAlign: 'center', marginBottom: 4, fontSize: 12}}>+237 691 380 458</Text>
                </View>
                <View style={{backgroundColor: 'white', borderTopLeftRadius: 33, borderTopRightRadius: 33}}>
                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={styles.titleMenu}>Mon Compte</Text>
                        <FlatList
                            data={accountItems}
                            renderItem={renderRow}
                            keyExtractor={item => item.title}/>
                    </View>

                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={styles.titleMenu}>Notifications</Text>
                        <FlatList
                            data={notificationItems}
                            renderItem={renderRow}
                            keyExtractor={item => item.title}/>
                    </View>

                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={styles.titleMenu}>Plus</Text>
                        <FlatList
                            data={plusItems}
                            renderItem={renderRow}
                            keyExtractor={item => item.title}/>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleMenu:{
        fontSize: 20,
        margin: 20,
        fontWeight: 'bold'
    }
});

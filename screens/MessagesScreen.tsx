import {FlatList, StyleSheet, Alert, Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import {Badge} from "react-native-paper";
import ChatItem from "../components/ChatItem";
import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
const height = Dimensions.get('screen').height;
import { FAB } from 'react-native-paper';

const DATA : any[] = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        createdAt: '08:45',
        nbUnReadMsgs: 1,
        user: {
            firstName: 'TEMATE',
            isCoach: false,
            lastName: 'Gaetan'
        }
    },   {
        id: 'bd7acbea-c1b1-46c2-aeh5-3ad53abb28b1',
        title: 'First Item',
        createdAt: '08:45',
        user: {
            firstName: 'Wilson',
            isCoach: false,
            lastName: 'Fisc'
        }
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        createdAt: 'Avr 25 2021',
        nbUnReadMsgs: 3,
        user: {
            firstName: 'Piere',
            isCoach: true,
            lastName: 'Felix'
        }
    },
    {
        id: '3ac68asc-c605-48d3-a4f8-fbd91aa97f6Z',
        title: 'Second Item',
        createdAt: 'Avr 25 2021',
        nbUnReadMsgs: 3,
        user: {
            firstName: 'Samuel',
            isCoach: false,
            lastName: 'pitou'
        }
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        createdAt: '11:45',
        nbUnReadMsgs: 0,
        user: {
            firstName: 'Rigobert',
            isCoach: false,
            lastName: 'Jean'
        }
    },
];

export default function MessagesScreen({navigation}) {
    const Tab = createMaterialTopTabNavigator();
    return (
        <Tab.Navigator initialRouteName={"Discussion"}
                       screenOptions={{
                           tabBarActiveTintColor: Colors.light.sekhmetGreen,
                           tabBarIndicatorStyle: {backgroundColor: Colors.light.sekhmetGreen},
                           tabBarLabelStyle: {fontSize: 12},
                       }}
        >
            <Tab.Screen name="Discussion"
                        options={{
                            tabBarLabel: () => <View
                                style={styles.tabItem}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Discussions</Text>
                                <Badge
                                    style={{marginVertical: 10, backgroundColor: Colors.light.sekhmetGreen}}>
                                    {DATA.filter(v=>v.nbUnReadMsgs).reduce((a, {nbUnReadMsgs}) => a + nbUnReadMsgs, 0)}
                                </Badge>
                            </View>
                        }}
                        children={() => <Discussion navigation={navigation}/>}/>
            <Tab.Screen name="Groupes"
                        options={{
                            tabBarLabel: () => <View style={styles.tabItem}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Groupes</Text>
                            </View>
                        }}
                        children={() => <Groupes navigation={navigation}/>}/>

        </Tab.Navigator>

    );
}
const Discussion = ({navigation}) => {
    return (<View  style={styles.container}>
        <FlatList
            data={DATA}
            renderItem={({item}) => (
                <ChatItem item={item} navigation={navigation}/>
            )}
            keyExtractor={item => item.id}
        />

        <FAB
            style={styles.fab}
            small
            uppercase={false}
            label={"Nouvelle discussion"}
            icon="comment-text-outline"
            onPress={() => console.log('Pressed')}
        />
    </View>)
}

const Groupes = (navigation) => <View style={styles.container}>
    <Text style={styles.title}>GROUPE Tab</Text>
</View>


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 120,
        alignItems: 'center',
    },
    fab: {
        backgroundColor: Colors.light.sekhmetOrange,
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

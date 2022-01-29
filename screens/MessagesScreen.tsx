import {FlatList, StyleSheet, Alert, Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import ChatItem from "../components/ChatItem";
import * as React from "react";

const height = Dimensions.get('screen').height;
import {Badge, FAB} from "react-native-elements";

const DATA: any[] = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        createdAt: '08:45',
        nbUnReadMsgs: 1,
        user: {
            firstName: 'TEMATE',
            isCoach: true,
            lastName: 'Gaetan'
        }
    }, {
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
                                    value={DATA.filter(v => v.nbUnReadMsgs).reduce((a, {nbUnReadMsgs}) => a + nbUnReadMsgs, 0)}
                                    badgeStyle={{marginVertical: 10, backgroundColor: Colors.light.sekhmetGreen}}
                                />
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
    return (<View style={styles.container}>
        <FlatList
            data={DATA}
            renderItem={({item}) => (
                <ChatItem item={item} navigation={navigation}/>
            )}
            keyExtractor={item => item.id}
        />

        <FAB
            style={styles.fab}
            size="small"
            color={Colors.light.sekhmetOrange}
            title={"Nouvelle discussion"}
            icon={{name: "comment", color: "white"}}
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
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

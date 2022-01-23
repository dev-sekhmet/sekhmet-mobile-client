import {StyleSheet} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import {Badge} from "react-native-paper";

export default function MessagesScreen({navigation}) {
    const Tab = createMaterialTopTabNavigator();
    return (
        <Tab.Navigator initialRouteName={"Discussion"}
                       screenOptions={{
                           tabBarActiveTintColor: Colors.light.sekhmetGreen,
                           tabBarLabelStyle: {fontSize: 12}
                       }}
        >
            <Tab.Screen name="Discussion"
                        options={{
                            tabBarIndicatorStyle: {borderBottomColor: Colors.light.sekhmetGreen},
                            tabBarLabel: () => <View
                                style={styles.tabItem}>
                                <Text>Discussion</Text>
                                <Badge style={{marginVertical:10}}>3</Badge>
                            </View>
                        }}
                        component={Discussion}/>
            <Tab.Screen name="Groupes"
                        options={{
                            tabBarIndicatorStyle: {borderBottomColor: Colors.light.sekhmetGreen},
                            tabBarLabel: () => <View style={styles.tabItem}>
                                <Text>Groupes</Text>
                            </View>
                        }}
                        component={Groupes}/>
        </Tab.Navigator>
    );
}

const Discussion = () => <View style={styles.container}>
    <Text style={styles.title}>CHAT Tab</Text>
</View>

const Groupes = () => <View style={styles.container}>
    <Text style={styles.title}>GROUPE Tab</Text>
</View>


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

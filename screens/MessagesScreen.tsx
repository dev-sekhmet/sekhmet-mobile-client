import {StyleSheet} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text, View} from '../components/Themed';
import Colors from "../constants/Colors";
import {Badge} from "react-native-paper";
import {color} from "react-native-elements/dist/helpers";

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
                                <Badge style={{marginVertical:10, backgroundColor: Colors.light.sekhmetGreen}}>2</Badge>
                            </View>
                        }}
                        component={Discussion}/>
            <Tab.Screen name="Groupes"
                        options={{
                            tabBarLabel: () => <View style={styles.tabItem}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Groupes</Text>
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
    }
});

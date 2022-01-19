/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Pressable, Text, View} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import {RootStackParamList, RootTabParamList, RootTabScreenProps} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import MessagesScreen from "../screens/MessagesScreen";
import ProfilScreen from "../screens/ProfilScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import {useContext} from "react";
import AppContext from "../components/AppContext";
import TermsConditionsScreen from "../screens/registration/TermsConditionsScreen";
import InputPhoneNumberScreen from "../screens/registration/InputPhoneNumberScreen";
import VerifyCodeScreen from "../screens/registration/VerifyCodeScreen";
import RegisterScreen from "../screens/registration/RegisterScreen";
import {createStackNavigator} from "@react-navigation/stack";

export default function Navigation({colorScheme, doneOnBoarding, handleLogin, handleLogout}) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator doneOnBoarding={doneOnBoarding} handleLogin={handleLogin}/>
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
// const Stack = createNativeStackNavigator<RootStackParamList>();
const Stack = createStackNavigator();
function RootNavigator({doneOnBoarding, handleLogin}) {
    const context = useContext(AppContext);
    return (
        context.onBoarding ?
            context.login ?
                <Stack.Navigator>
                    <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/>
                    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
                    <Stack.Group screenOptions={{presentation: 'modal'}}>
                        <Stack.Screen name="Modal" component={ModalScreen}/>
                    </Stack.Group>
                </Stack.Navigator> : <Stack.Navigator screenOptions={{}}>
                    <Stack.Screen options={{headerShown: false}} name="Terms" component={TermsConditionsScreen}/>
                    <Stack.Screen options={{headerShadowVisible: false, headerStyle:{backgroundColor: 'white'}, headerTitle: ''}} name="InputPhone" component={InputPhoneNumberScreen}/>
                    <Stack.Screen options={{headerShadowVisible: false, headerStyle:{backgroundColor: 'white'}, headerTitle: ''}} name="VerifyCode" component={VerifyCodeScreen}/>
                    <Stack.Screen options={{headerShadowVisible: false, headerStyle:{backgroundColor: 'white'}, headerTitle: ''}} name="Register" children={() => {
                        return (
                            <RegisterScreen handleLogin={handleLogin}/>
                        )
                    }}/>
                </Stack.Navigator> : <OnBoardingScreen done={doneOnBoarding}/>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10
                },
                tabBarIconStyle: {
                  marginBottom: 3
                },
                tabBarBadgeStyle: {
                    backgroundColor: "#254304"
                },
                tabBarActiveTintColor: "#62A01A",
                
            }}>
            <BottomTab.Screen
                name="Home"
                
                component={HomeScreen}
                options={({navigation}: RootTabScreenProps<'Home'>) => ({
                    title: 'Home',
                    headerShadowVisible: false,
                    
                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: ({color}) => <TabBarIcon name="home"  color={color}/>,
                    headerRight: () => (
                        <View style={{flexDirection: 'row'}}>
                        <Pressable
                            onPress={() => {}}
                            style={({pressed}) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <FontAwesome
                                name="search"
                                size={25}
                                color="grey"
                                style={{marginRight: 15, fontWeight: 'bold'}}
                            />
                        </Pressable>
                            <Pressable
                                onPress={() => {}}
                                style={({pressed}) => ({
                                    opacity: pressed ? 0.5 : 1,
                                })}>
                                <MaterialIcons
                                    name="more-vert"
                                    size={25}
                                    color="grey"
                                    style={{marginRight: 15, fontWeight: 'bold'}}
                                />
                            </Pressable>
                        </View>
                    ),
                })}
            />
            <BottomTab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    title: 'Messages',
                    tabBarLabelPosition: 'below-icon',
                    tabBarBadge: 5,                    
                    tabBarIcon: ({color}) => <TabBarIcon name="comments" color={color}/>,
                }}
            />

            <BottomTab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    title: 'Notifications',
                    tabBarLabelPosition: 'below-icon',
                    tabBarBadge: 1,
                    tabBarIcon: ({color}) => <TabBarIcon name="bell" color={color}/>,
                }}
            />

            <BottomTab.Screen
                name="Profil"
                component={ProfilScreen}
                options={{
                    title: 'Profil',
                    tabBarLabelPosition: 'below-icon',
                    tabBarIcon: ({color}) => <TabBarIcon name="user" color={color}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{marginBottom: -3}} {...props} />;
}

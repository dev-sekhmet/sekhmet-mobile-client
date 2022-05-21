import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {Text, View} from "../../components/Themed";
import {Dimensions, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {AntDesign, FontAwesome5} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import * as React from "react";
import ProductItem from "../../components/ProductItem";

import AstuceItem from "../../components/AstuceItem";
import {DataAstuces, DataProducts} from "../sampleData";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const AdminHomeScreen = ({navigation}) => {

    const Tab = createMaterialTopTabNavigator();

    const editProduct = (event) => {
            navigation.navigate("ProductEdit", {
                product: {
                    title: "Ajouter un produit Sekhmet"
                },
                backScreenName: "Home"
            });
    }

    return (
        <View style={styles.admincontainer}>
            <View style={{flexDirection: "row", backgroundColor: 'transparent'}}>
                <TouchableOpacity style={styles.card}>
                    <View style={[styles.fontCommon, {backgroundColor: '#fff6ee'}]}>
                        <FontAwesome5 name="users" size={24} style={{alignSelf: 'center'}}
                                      color={Colors.light.sekhmetOrange}/>
                    </View>
                    <Text style={[styles.number, {color: Colors.light.sekhmetOrange}]}>314</Text>
                    <Text style={{color: Colors.light.colorTextGrey}}>Clients</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.card]}>
                    <View style={[styles.fontCommon, {backgroundColor: '#efffdc'}]}>
                        <FontAwesome5 name="headset" style={{alignSelf: 'center'}} size={24}
                                      color={Colors.light.sekhmetGreen}/>
                    </View>
                    <Text style={[styles.number, {color: Colors.light.sekhmetGreen}]}>25</Text>
                    <Text style={{color: Colors.light.colorTextGrey}}>Coachs</Text>
                </TouchableOpacity>
            </View>

            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: Colors.light.sekhmetGreen,
                    tabBarIndicatorStyle: {backgroundColor: Colors.light.sekhmetGreen},
                    tabBarLabelStyle: {fontSize: 12},
                }}
            >
                <Tab.Screen name="Produits sekhmet"
                            children={() => <View style={{flexDirection: 'column', height: height * 0.8}}>
                                <TouchableOpacity style={[styles.ajouterButton]} onPress={()=>editProduct(null)}>
                                    <AntDesign name="plus" size={24} color="black"/>
                                    <Text style={{marginLeft: 10, color: Colors.light.colorTextGrey}}>Ajouter un produit
                                        sekhmet</Text>
                                </TouchableOpacity>
                                <View style={{margin: 20}}>
                                    <FlatList data={DataProducts}
                                              keyExtractor={(item: any) => item.id}
                                              renderItem={({item, index}) => (
                                                  <ProductItem navigation={navigation} item={item}
                                                               index={index}/>)}/>
                                </View>
                            </View>}/>
                <Tab.Screen name="Astuces et Conseils"
                            children={() => <View style={{flexDirection: 'column', height: height * 0.8}}>
                                <TouchableOpacity style={[styles.ajouterButton]}>
                                    <AntDesign name="plus" size={24} color="black"/>
                                    <Text style={{marginLeft: 10, color: Colors.light.colorTextGrey}}>Ajouter une astuce
                                        et conseil</Text>
                                </TouchableOpacity>
                                <View style={{margin: 20}}>
                                    <FlatList data={DataAstuces}
                                              keyExtractor={(item: any) => item.id}
                                              renderItem={({item, index}) => (
                                                  <AstuceItem navigation={navigation} item={item}
                                                              index={index}/>)}/>
                                </View>
                            </View>}/>

            </Tab.Navigator>
        </View>)
};
export default AdminHomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    admincontainer: {
        flex: 1,
        backgroundColor: '#F9F8FD'
    },
    card: {
        flex: 1,
        padding: 20,
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: 'center',
        marginHorizontal: "2%",
        margin: 10,
        alignItems: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.57,
        shadowRadius: 0.19,
    },
    ajouterButton: {
        flex: 1,
        padding: 5,
        borderRadius: 10,
        maxHeight: height * 0.05,
        flexDirection: 'row', justifyContent: 'center',
        backgroundColor: "white",
        marginHorizontal: "2%",
        margin: 10,
        marginTop: 15,
        alignItems: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.57,
    },
    number: {
        marginTop: 10,
        fontSize: 20
    },
    fontCommon: {
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25
    }
});

import {Dimensions, FlatList, ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, View} from '../components/Themed';
import * as React from "react";
import {useEffect, useState} from "react";
import {useAppSelector} from "../api/store";
import {hasAnyAuthority} from "../components/PrivateRoute";
import {AUTHORITIES} from "../constants/constants";
import {AntDesign, FontAwesome5} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const DataProducts = [
    {
        id: 1,
        title: 'Muesli Croustilles',
        subtitle: 'By Coach Emy',
        image: require('../assets/images/prods/p1.png')
    },
    {
        id: 2,
        title: 'Breuvage Ventre Plat Et Détox',
        subtitle: 'Dégonflage Ventre',
        image: require('../assets/images/prods/p2.png')
    },
    {
        id: 3,
        title: 'Plats Diététiques',
        subtitle: 'Avec alliés minceurs',
        image: require('../assets/images/prods/p3.png')
    }

]
const DataAstuces = [
    {
        id: 1,
        cat: 'Sekhmet',
        title: 'Manger au moins 5 fruits et legumes',
        subtitle: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry hey hey hey hey hey',
        image: require('../assets/images/prods/p4.png')
    },
]


export default function HomeScreen({navigation}) {
    const [items, setItems] = useState([false, false]);
    const [isRefreshing, setRefresh] = useState(false);
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentification.account.authorities, [AUTHORITIES.ADMIN]));
    useEffect(() => {
        console.log("isAdmin ", isAdmin);
    }, [])

    const refreshData = async () => {
        setRefresh(true);

        setTimeout(() => {
            console.log("You started the refresh process !");
            setRefresh(false);
        }, 2000);
    }
    const homePart = [
        {id: 1, text: 'Nos produits Sekhmet', data: DataProducts},
        {id: 2, text: 'Conseils & Astuces de la semaine', data: DataAstuces},
    ]

    return (
        isAdmin ? <AdminHome navigation={navigation}/>
            :
            <View style={styles.container}>
                <SafeAreaView/>
                <FlatList refreshing={false} onRefresh={() => {
                }}
                          keyExtractor={(item: any) => item.id}
                          data={homePart}
                          contentContainerStyle={{alignContent: 'center', paddingHorizontal: 16}}
                          renderItem={({item, index}) => {
                              let parentIndex = index;
                              return <View style={{marginBottom: 12}}>

                                  <Text style={{
                                      textAlign: 'left',
                                      alignSelf: 'flex-start',
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                      marginBottom: 10,
                                      color: 'grey'
                                  }}>{item.text}</Text>
                                  <FlatList data={item.data}
                                            keyExtractor={(item: any) => item.id}
                                            renderItem={({item, index}) => (
                                                // {
                                                (index <= 1 || items[0])
                                                    ?
                                                    parentIndex == 0 ? <ProductItem navigation={navigation} item={item}
                                                                                    index={index}/> :
                                                        <AstuceItem navigation={navigation} item={item} index={index}/>
                                                    :
                                                    <TouchableOpacity style={{alignItems: 'center'}}
                                                                      onPress={() => parentIndex == 0 ? setItems([true, items[1]]) : setItems([items[0], true])}>
                                                        <Text style={{
                                                            textAlign: 'center',
                                                            color: '#62A01A',
                                                            fontStyle: 'italic'
                                                        }}>Voir
                                                            plus de produits...</Text>
                                                    </TouchableOpacity>
                                                // }
                                            )}/>
                              </View>
                          }
                          }/>
            </View>
    );
}
//For product listing
const ProductItem = ({item, index, navigation}) => {
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("ProductDetail", {
                    product: item,
                    backScreenName: "Home"
                });
            }}>
            <View style={{
                flex: 1,
                height: 120,
                backgroundColor: index == 0 ? 'orangered' : 'whitesmoke',
                borderRadius: 15,
                marginBottom: 10
            }}>
                <View style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingHorizontal: 8
                    }}>
                        <Text style={{
                            color: index == 0 ? 'white' : 'black',
                            fontSize: 16,
                            marginBottom: 10
                        }}>{item.title}</Text>
                        <Text style={{
                            color: index == 0 ? 'whitesmoke' : 'grey',
                            marginBottom: 10
                        }}>{item.subtitle}</Text>
                    </View>
                    <View style={{
                        width: '40%',
                        backgroundColor: 'black',
                        alignItems: 'flex-end',
                        borderRadius: 12,
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <ImageBackground
                            style={{width: '100%', height: '100%', flex: 1, borderRadius: 12}}
                            resizeMode="cover" source={item.image}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const AstuceItem = ({item, index, navigation}) => {
    return (
        <View style={{
            flex: 1,
            height: 90,
            backgroundColor: 'whitesmoke',
            borderRadius: 15,
            marginBottom: 10
        }}>
            <View style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    paddingHorizontal: 8
                }}>
                    <Text style={{
                        color: '#62A01A',
                        fontSize: 10,
                    }}>{item.cat}</Text>

                    <Text style={{
                        color: 'black',
                        fontSize: 13,
                        marginBottom: 8
                    }}>{item.title.length > 40 ? item.title.substr(0, 40) + ' ...' : item.title}</Text>
                    <Text style={{
                        color: 'grey',
                        marginBottom: 5,
                        overflow: 'scroll'
                    }}>{item.subtitle.substr(0, 20) + '...'}</Text>
                </View>
                <View style={{
                    width: '40%',
                    backgroundColor: 'black',
                    alignItems: 'flex-end',
                    borderRadius: 12,
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <ImageBackground
                        style={{width: '100%', height: '100%', flex: 1, borderRadius: 12}}
                        resizeMode="cover" source={item.image}/>
                </View>
            </View>
        </View>
    )
}

const AdminHome = ({navigation}) => {

    const Tab = createMaterialTopTabNavigator();
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
                                <TouchableOpacity style={[styles.ajouterButton]}>
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

import {
    Dimensions,
    FlatList,
    ImageBackground,
    Pressable,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {Text, View} from '../components/Themed';
import {useState} from "react";

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

    //For product listing
    const ProductItem = ({item, index}) => {
        return (
            <Pressable
                onPress={() => {
                    navigation.navigate("ProductDetail", {
                        product: item,
                        backScreenName: "Home"
                    });
                }}
                style={({pressed}) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>
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
            </Pressable>
        )
    }

    const AstuceItem = ({item, index}) => {
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
    return (
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
                                                parentIndex == 0 ? <ProductItem item={item} index={index}/> :
                                                    <AstuceItem item={item} index={index}/>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

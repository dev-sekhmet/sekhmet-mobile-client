import {Dimensions, ImageBackground, StyleSheet} from 'react-native';
import {Text, View} from '../components/Themed';
import {useEffect, useState} from "react";
import Colors from "../constants/Colors";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function ProductDetail({navigation, route}) {
    const [product, setProduct] = useState<any>({});

    useEffect(() => {
        if (route.params?.product) {
            setProduct(route.params.product);
        }
    }, [route.params?.product]);
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={[{fontSize: 16}, styles.title]}>{product.title}</Text>
                    <Text style={styles.title}>{product.subtitle}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        style={{width: '100%', height: '100%', flex: 1, borderRadius: 12}}
                        resizeMode="cover" source={require('../assets/images/prods/p1.png')}/>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: "center",
                borderRadius: 15,
                margin: 10,
                height: 200,
            }}>
                <View style={{
                    width: '45%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: 'lightgreen'
                }}>
                    <ImageBackground
                        style={{width: '100%', height: '100%', flex: 1, borderRadius: 12}}
                        resizeMode="cover" source={require('../assets/images/expo-muesli-croustilles.png')}/>
                </View>
                <View style={{
                    flexDirection: 'column',
                    width: '55%',
                    height: '100%',
                    margin: 10,
                    paddingTop: 20
                }}>
                    <Text style={[{fontSize: 16}, {
                        justifyContent: 'flex-start',
                        color: '#62A01A'
                    }]}>{'Muesli Croustilles'}</Text>
                    <Text style={{
                        color: Colors.light.sekhmetOrange,
                        marginBottom:10
                    }}>{'By coach Emy'}
                    </Text>

                    <Text>{'Long established fact that a reader will be distracted by the readable content of a page when looking at its'}</Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: 'white',
        marginBottom: 10
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        borderRadius: 15,
        margin: 10,
        height: 150,
        backgroundColor: 'orangered'
    },
    imageContainer: {
        width: '40%',
        borderRadius: 12,
        overflow: 'hidden'
    },
    textContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 8
    }
});

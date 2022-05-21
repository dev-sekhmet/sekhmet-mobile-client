import {ImageBackground, TouchableOpacity} from "react-native";
import {Text, View} from "./Themed";
import * as React from "react";

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

export default ProductItem;
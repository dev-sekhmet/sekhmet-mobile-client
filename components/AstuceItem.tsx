import {Text, View} from "./Themed";
import {ImageBackground} from "react-native";
import * as React from "react";


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

export default AstuceItem;
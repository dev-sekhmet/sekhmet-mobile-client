import {Dimensions, Image, Pressable, StyleSheet} from 'react-native';
import {View} from '../components/Themed';
import {useEffect} from "react";
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function ModalScreen({route}) {
    return (
        <View style={{ flex: 1,
            overflow: 'hidden',
            alignItems: 'center',
            position: 'relative',
            margin: 10}}>
            <Image resizeMethod={'scale'} style={{
                flex: 1,width: '100%',
                height: undefined,}} source={{uri:route.params.uri}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
const { height, width } = Dimensions.get('window');
export default function VideoPlayer({style, uri}) {
    const playbackInstance = useRef<Video>(null);

    const getOnTouchEnd = ()=> {
     console.log('TOUCHE');
    }

    return (
        <View style={{flex:1}}>
            <Video
                ref={playbackInstance}
                style={[style]}
                useNativeControls
                source={{ uri}}
                resizeMode="cover"
                isLooping
            />
        </View>
    );
}
const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        width: width,
        height: height/1.6
    }
});
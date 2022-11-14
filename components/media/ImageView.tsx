import React, {useEffect, useState} from "react";
import {Image, Pressable, StyleSheet, View} from "react-native";
import SekhmetActivityIndicator from "../SekhmetActivityIndicator";

const ImageView = ({uri, style, navigator}) => {
    const [loading, setLoading] = useState(false);

    const showFullScreen = () => {
        navigator.navigate("Modal", {
            uri
        });
    }

    /*const onLoading = (value, lable) => {
        console.log(value, lable);
        setLoading(value);
    }*/

    return (
        <View>
            <Pressable
                onPress={showFullScreen}>
                <Image style={[style, {display: loading? 'none':'flex'}]}
                       source={{uri}}
/*                       onLoadStart={() => onLoading(true, 'Start')}
                       onLoadEnd={() => onLoading(false, 'End')}*/
                />
            </Pressable>
            {loading && <SekhmetActivityIndicator size="small" />}
        </View>
    );
};

const styles = StyleSheet.create({});

export default ImageView;
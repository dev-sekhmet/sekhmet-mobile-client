import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {View, Text, Pressable, StyleSheet, Image} from "react-native";
import {getFriendlyName} from "../../shared/conversation/conversation.util";

const  ImageView = ({ uri, style, navigator}) => {
    const [fullScreen, setFullScreen] = useState(false);

    const showFullScreen= ()=> {
        navigator.navigate("Modal", {
            uri
        });
    }

    return (
        <View>{!fullScreen &&
            <Pressable

                onPress={showFullScreen}>
                <Image style={style} source={{uri}}/>
            </Pressable>}
        </View>
    );
};

const styles = StyleSheet.create({

});

export default ImageView;
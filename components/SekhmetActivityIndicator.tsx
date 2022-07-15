import Colors from "../constants/Colors";
import {ActivityIndicator, StyleSheet} from "react-native";
import React from "react";

const SekhmetActivityIndicator = (props) => {
    return <ActivityIndicator style={props.style? props.style : styles.loading} size={props.size? props.size :'large'} color={Colors.light.sekhmetGreen}/>
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default SekhmetActivityIndicator;
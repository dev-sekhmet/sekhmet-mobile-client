import React from "react";
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/core";
import OTPInputView from "@twotalltotems/react-native-otp-input/dist";
import {MaterialIcons} from '@expo/vector-icons';


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const VerifyCodeScreen = () => {
    const navigation = useNavigation();

    const checkCode = (code) => {
        console.log("Here the code", code);
        navigation.navigate('Register');
    }
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View style={{paddingVertical: 10, alignItems: 'center'}}>
                        <Text style={styles.title}>Enter your verification code</Text>
                    </View>
                    <View style={{paddingBottom: 10, alignItems: 'center'}}>
                        <Text style={styles.subtitle}>
                            +(237) 697 856 482 . <Text onPress={() => navigation.goBack()} style={styles.link}>Wrong
                            number ?</Text>
                        </Text>
                    </View>
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <OTPInputView
                            style={{width: "80%", height: 5, marginBottom: 20}}
                            pinCount={6}
                            autoFocusOnLoad
                            placeholderCharacter="-"
                            selectionColor="black"
                            placeholderTextColor="black"
                            codeInputFieldStyle={styles.underlineStyleBase}
                            // codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code) => {
                                checkCode(code);
                            }}
                        />
                        <View style={{height: 2.0, width: width * 0.8, backgroundColor: 'grey'}}/>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'grey', fontWeight: "bold"}}>Enter 6-digit
                                code</Text>
                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                        paddingHorizontal: 10
                    }}>
                        <View>
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                            }}>
                                <MaterialIcons name="message" color="grey" style={{marginRight: 5, fontWeight: 'bold'}} size={20}/>
                                <Text style={{color: 'grey', fontWeight: 'bold'}}>Resend SMS</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color: 'grey'}}>
                            0:59
                        </Text>
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                        paddingHorizontal: 10
                    }}>
                        <View>
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                            }}>
                                <MaterialIcons name="call" color="grey" style={{marginRight: 5, fontWeight: 'bold'}} size={20}/>
                                <Text style={{color: 'grey', fontWeight: 'bold'}}>Call me</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color: 'grey'}}>
                            0:59
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        color: 'black',
        fontSize: 22,
        // maxWidth: '70%',
        fontWeight: 'bold',
        // marginTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: 'grey',
        fontSize: 13,
        marginTop: 0,
        marginBottom: 20,
        maxWidth: '95%',
        textAlign: 'center',
        lineHeight: 20,
    },
    link: {
        color: '#62A01A'
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 0,
        color: "black",
        fontSize: 20,
    },

    underlineStyleHighLighted: {
        borderColor: "transparent",
    },
})

export default VerifyCodeScreen;

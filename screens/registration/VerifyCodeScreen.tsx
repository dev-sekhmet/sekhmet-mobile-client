import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/core";
import OTPInputView from "@twotalltotems/react-native-otp-input/dist";
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {ListItem} from "react-native-elements";
import {getChannelComponent} from "./InputPhoneNumberScreen";
import {VerificationChannel} from "../../model/enumerations/verification-channel.model";
import { useAppDispatch, useAppSelector } from '../../api/store';
import {errorToast} from "../../components/toast";
import {
    checkVerification,
    getSession,
    resetAuthentication,
    resetStartVerification
} from "../../api/authentification/authentication.reducer";
import {AxiosResponse} from "axios";
import Colors from "../../constants/Colors";


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const VerifyCodeScreen = ({ route, navigation }) => {
    const dispatch = useAppDispatch();
    const [sendCode, setSendCode] = useState(false);
    const loginError = useAppSelector(state => state.authentification.loginError);
    const phoneNumber :string = route.params.phoneNumber;

    useEffect(() => {
        if (loginError){
            setSendCode(false);
            errorToast('Erreur de Verification', 'Votre numero n\'a pas pu etre verifié')
            dispatch(resetAuthentication());
        }
    }, [loginError]);

    useEffect(() => {
        return () => {
            setSendCode(false);
            dispatch(resetAuthentication());
        };
    }, []);

    const checkVerificationCode = (token: string) => {
        if (phoneNumber && phoneNumber.length >8) {
            setSendCode(true);
            dispatch(checkVerification({
                phoneNumber,
                token,
                locale: 'fr',
                langKey: 'fr'
            }))
        } else {
            errorToast('Numéro incorrect', 'Votre numero est incorrect')
        }
    }

    return (
        sendCode? <ActivityIndicator style={styles.loading} size="large" color={Colors.light.sekhmetGreen} />
            :
            <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor: 'white'}}>
                    <View style={{paddingVertical: 10, alignItems: 'center'}}>
                        <Text style={styles.title}>Enter your verification code</Text>
                    </View>
                    <View style={{paddingBottom: 10, alignItems: 'center'}}>
                        <Text style={styles.subtitle}>
                            {phoneNumber} <Text onPress={() => navigation.goBack()} style={styles.link}>Wrong
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
                            onCodeFilled={(code) => {
                                checkVerificationCode(code);
                            }}
                        />
                        <View style={{height: 2.0, width: width * 0.8, backgroundColor: 'grey'}}/>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{textAlign: 'center', color: 'grey', fontWeight: "bold"}}>Enter 6-digit
                                code</Text>
                        </View>
                    </View>
                    <View><Text>Renvoyer le code par </Text></View>
                    {getChannelComponent(
                        [
                            ()=>{console.log(" VerifyCodeScreen SSSSSSSSMMMMMMMMMMMMMSSSSSSSS")},
                            ()=>{console.log(" VerifyCodeScreen CAALLLLLLLLLL")},
                            ()=>{console.log("VerifyCodeScreen WWWWHHHHHATSSAAAAAAAAPPPP")}]
                    )}
                </View>
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

export default VerifyCodeScreen;

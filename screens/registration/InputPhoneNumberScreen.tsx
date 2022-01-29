import React, {useRef, useState} from "react";
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";

import PhoneInput from "react-native-phone-number-input";
import {Button} from "react-native-paper";

import Modal from 'react-native-modal';
import {useNavigation} from "@react-navigation/core";

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

const InputPhoneNumberScreen = () => {
    const navigation = useNavigation();
    const [value, setValue] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [disabled, setDisabled] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    const [confirmModal, setConfirmModal] = useState(false);

    const check = () => {
        // console.log("phone", formattedValue);
        // if(!phoneInput.current.isValidNumber(value)) {
        //     Alert.alert("Error", "Phone is not valid");
        // }else {
        // Alert.alert("Success", "Phone is correct");
        setConfirmModal(true);
        // }
    }

    const goNext = () => {
        setConfirmModal(false);
        navigation.navigate('VerifyCode');
    }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <Text style={styles.title}>Verify your phone number</Text>
                    </View>
                    <View style={{paddingVertical: 10, alignItems: 'center'}}>
                        <Text style={styles.subtitle}>Lorem Ipsum has been the industry's standard dummy text ever since
                            the 1500s,
                            when an unknown printer took a galley of type scrambled</Text>
                    </View>
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}
                            defaultCode="CM"
                            placeholder="N° de téléphone"
                            textContainerStyle={{backgroundColor: 'transparent'}}
                            textInputStyle={{backgroundColor: 'transparent'}}
                            layout="first"
                            onChangeText={(text) => {
                                setValue(text);
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                                // setCountryCode(phoneInput.current?.getCountryCode() || '');
                            }}
                            countryPickerProps={{withAlphaFilter: true}}
                            disabled={disabled}
                            withDarkTheme={false}
                            withShadow={false}
                            autoFocus={false}
                        />
                        <View style={{height: 2.0, width: width * 0.8, backgroundColor: 'grey'}}/>
                    </View>
                    <View style={{paddingVertical: 10, marginTop: 20, marginBottom: 20, alignItems: 'center'}}>
                        <Button mode="contained" onPress={check} contentStyle={{paddingHorizontal: 30}}
                                style={{borderRadius: 20, marginBottom: 10}} color="#62A01A">
                            Continuer
                        </Button>
                    </View>
                </ScrollView>

                <Modal
                    avoidKeyboard
                    onBackdropPress={() => setConfirmModal(false)}
                    animationIn={"slideInUp"}
                    isVisible={confirmModal}
                    swipeDirection={['down', 'up']}
                    onSwipeComplete={() => setConfirmModal(false)}>
                    <View style={{padding: 20, backgroundColor: 'white'}}>
                        <View >
                            <View>
                                <Text style={{fontSize: 16, marginBottom:10}}>We have verified the phone number :</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom:10}}>+(237) 697 856 482</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 16}}>Are you correct or do you want to change this number ?</Text>
                            </View>
                        </View>

                        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-end', paddingEnd: 10}}>
                            <Button mode="contained"
                                    onPress={goNext}
                                    style={{borderRadius: 5, marginBottom: 10}} color="#62A01A">
                                Yes
                            </Button>
                            <Button mode="contained" onPress={() => setConfirmModal(false)}
                                    style={{borderRadius: 5, marginBottom: 10, marginHorizontal: 10}} color="#f2f2f2">
                                Edit
                            </Button>
                        </View>
                    </View>
                </Modal>
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
})

export default InputPhoneNumberScreen;

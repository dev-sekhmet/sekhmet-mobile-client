import React, {useRef, useState} from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import PhoneInput from "react-native-phone-number-input";
import {useNavigation} from "@react-navigation/core";
import {ListItem} from "react-native-elements";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {phoneLogin} from "../../api/authentification.api";
import {VerificationChannel} from "../../model/enumerations/verification-channel.model";
import {errorToast} from "../../components/toast";

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export const getChannelComponent = (actions: (() => void)[]) => {
    const renderRow = ({item}) => {
        return (
            <ListItem>
                <ListItem.Content>
                    {item.content}
                </ListItem.Content>
            </ListItem>
        );
    };

    return <FlatList
        data={[
            {
                id: 0,
                content: <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                    actions[0]();
                }}>
                    <MaterialIcons name="message" color="grey"
                                   style={{marginRight: 5, fontWeight: 'bold'}} size={20}/>
                    <Text style={{color: 'grey', fontWeight: 'bold'}}>SMS</Text>
                </TouchableOpacity>

            },
            {
                id: 1,
                content: <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                    actions[1]();
                }}>
                    <MaterialIcons name="call" color="grey" style={{marginRight: 5, fontWeight: 'bold'}}
                                   size={20}/>
                    <Text style={{color: 'grey', fontWeight: 'bold'}}>Call me</Text>
                </TouchableOpacity>
            },
            {
                id: 2,
                content: <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                    actions[2]();
                }}>
                    <Ionicons name="logo-whatsapp" size={24} color="grey"
                              style={{marginRight: 5, fontWeight: 'bold'}}/>
                    <Text style={{color: 'grey', fontWeight: 'bold', marginTop: 4}}>WhatsApp</Text>
                </TouchableOpacity>

            }
        ]}
        renderItem={renderRow}
        keyExtractor={item => item.id}/>;
}

const InputPhoneNumberScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [disabled, setDisabled] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const sendCode = (channel: VerificationChannel) => {
        if (phoneNumber && phoneNumber.length > 8) {
            phoneLogin({
                phoneNumber,
                channel,
                locale: 'fr'
            }).subscribe({
                next(x) {
                    console.log('got value ' + x);
                    navigation.navigate('VerifyCode', {
                            phoneNumber
                    });
                },
                error(err) {
                    console.error('something wrong occurred: ' + err);
                },
                complete() {
                    console.log('done');
                }
            });
        } else {
            errorToast('Numéro incorrect', 'Votre numero est incorrect')
        }
    }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor: 'white'}}>
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <Text style={styles.title}>Connectez vous avec votre Numero de Téléphone</Text>
                    </View>
                    <View style={{paddingVertical: 10, alignItems: 'center'}}>
                        <Text style={styles.subtitle}>Lorem Ipsum has been the industry's standard dummy text ever since
                            the 1500s,
                            when an unknown printer took a galley of type scrambled</Text>
                    </View>
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <PhoneInput
                            ref={phoneInput}
                            defaultCode="CM"
                            placeholder="N° de téléphone"
                            textContainerStyle={{backgroundColor: 'transparent'}}
                            textInputStyle={{backgroundColor: 'transparent'}}
                            layout="first"
                            onChangeFormattedText={(phoneNumber) => {
                                console.log("onChangeFormattedText ", phoneNumber);
                                setPhoneNumber(phoneNumber);
                            }}
                            countryPickerProps={{withAlphaFilter: true}}
                            disabled={disabled}
                            withDarkTheme={false}
                            withShadow={false}
                            autoFocus={false}
                        />
                        <View style={{height: 2.0, width: width * 0.8, backgroundColor: 'grey'}}/>
                    </View>
                    {getChannelComponent([
                        () => {
                            sendCode(VerificationChannel.SMS)
                        },
                        () => {
                            sendCode(VerificationChannel.CALL)
                        },
                        () => {
                            sendCode(VerificationChannel.WHATSAPP)
                        }]
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
})

export default InputPhoneNumberScreen;

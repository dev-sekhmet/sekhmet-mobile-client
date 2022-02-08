import React, {useEffect, useRef, useState} from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import PhoneInput from "react-native-phone-number-input";
import {ListItem} from "react-native-elements";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useAppDispatch, useAppSelector} from '../../api/store';
import {VerificationChannel} from "../../model/enumerations/verification-channel.model";
import {errorToast} from "../../components/toast";
import {resetStartVerification, startVerification} from "../../api/authentification/authentication.reducer";

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

const InputPhoneNumberScreen = ({navigation}) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [disabled, setDisabled] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    const dispatch = useAppDispatch();

    const startVerificationSuccess = useAppSelector(state => state.authentification.startVerificationSuccess);
    const startVerificationError = useAppSelector(state => state.authentification.startVerificationError);

    useEffect(() => {
        if (startVerificationError) {
            errorToast('Erreur code', 'Erreur lors de l\'envoi du code, vérifier votre numéro de téléphone')
            dispatch(resetStartVerification());
        }
    }, [startVerificationError]);


    useEffect(() => {
        if (startVerificationSuccess) {
            navigation.navigate('VerifyCode', {
                phoneNumber
            });

        }
    }, [startVerificationSuccess]);

    useEffect(() => {
        return () => {
            dispatch(resetStartVerification());
        };
    }, []);

    const sendCode = (channel: VerificationChannel) => {
        if (phoneNumber && phoneNumber.length > 8) {
            dispatch(startVerification({
                phoneNumber,
                channel,
                locale: 'fr'
            }));
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
                        <Text style={styles.subtitle}>Un code va vous etre envoyer par un de moyen que vous aurez choisie (SMS, Appel ou Whatsapp){'\n'}
                            entrez ce code dans l'écran suivant pour vous connecter </Text>
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

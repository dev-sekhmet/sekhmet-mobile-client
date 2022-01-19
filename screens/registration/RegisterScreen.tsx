import React from "react";
import {Dimensions, SafeAreaView, ScrollView, Text, TextInput, View} from "react-native";
import {Avatar} from "react-native-elements";
import {Button} from "react-native-paper";
import {useNavigation} from "@react-navigation/core";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const RegisterScreen = ({handleLogin}) => {
    // const navigation = useNavigation();

    // const saveData = async () => {
    //     navigation.
    // }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView style={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={{paddingVertical: 10, alignItems: 'center'}}>
                        <Avatar
                            size={80}
                            rounded
                            icon={{
                                name: 'camera-alt',
                                type: 'material',
                                color: 'grey',
                            }}
                            containerStyle={{
                                borderColor: 'grey',
                                borderStyle: 'solid',
                                borderWidth: 1,
                            }}
                        />
                        <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 4, fontSize: 15}}>Photo de
                            profil</Text>
                        <View style={{height: 1.0, marginTop: 1, width: width * 0.8, backgroundColor: 'grey'}}/>
                    </View>

                    {/*For first name*/}
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                            nom*</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={text => {
                            }}
                            placeholder="Nom"
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    {/*    For lastname*/}
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                            prenom</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={text => {
                            }}
                            placeholder="Prenom"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    {/*    For email*/}
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Adresse
                            email</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={text => {
                            }}
                            placeholder="Adresse Email"
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <View style={{paddingVertical: 10, marginTop: 20, marginBottom: 20, alignItems: 'center'}}>
                        <Button mode="contained" onPress={handleLogin} contentStyle={{paddingHorizontal: 50}}
                                style={{borderRadius: 20, marginBottom: 10}} color="#62A01A">
                            Terminer
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
export default RegisterScreen;

import React, {useEffect} from "react";
import {Dimensions, SafeAreaView, ScrollView, Text, TextInput, View} from "react-native";
import {Avatar} from "react-native-elements";
import {Button} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "../../api/store";
import {successToast} from "../../components/toast";
import {reset, saveAccountSettings} from '../../api/settings/settings.reducer';
import {Controller, useForm} from "react-hook-form";
import {color} from "react-native-elements/dist/helpers";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
/*
const Input = ({name, control, style}) => {
    const {field} = useController({
        control,
        defaultValue: '',
        name
    })
    return (<TextInput
        value={field.value}
        style={style}
        placeholder={name}
        underlineColorAndroid="transparent"
        onChangeText={field.onChange}/>)
}*/
const RegisterScreen = () => {
    const account = useAppSelector(state => state.authentification.account);
    const successMessage = useAppSelector(state => state.settings.successMessage);
    const dispatch = useAppDispatch();
    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: ''
        }
    });


    const onSubmit = data => console.log(data);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            successToast("Success", "Success save ")
        }
    }, [successMessage]);

    const handleValidSubmit = values => {
        dispatch(
            saveAccountSettings({
                ...account,
                ...values,
            })
        );
    };

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView style={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
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
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="firstName"
                        />
                        {errors.firstName && <Text style={{color: 'red'}}>This is required.</Text>}
                    </View>

                    {/*    For lastname*/}
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                            prenom</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="lastName"
                        />
                        {errors.lastName && <Text style={{color: 'red'}}>This is required.</Text>}
                    </View>

                    {/*    For email*/}
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Adresse
                            email</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text style={{color: 'red'}}>This is required.</Text>}
                    </View>

                    <View style={{paddingVertical: 10, marginTop: 20, marginBottom: 20, alignItems: 'center'}}>
                        <Button mode="contained" onPress={handleSubmit(handleValidSubmit)}
                                contentStyle={{paddingHorizontal: 50}}
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

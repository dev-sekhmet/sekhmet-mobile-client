import {
    ColorValue,
    Dimensions,
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput
} from 'react-native';
import {Text, View} from '../components/Themed';
import {Avatar, Badge, Icon, ListItem, Switch} from "react-native-elements";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Colors from "../constants/Colors";
import Modal from 'react-native-modal';
import {IUser} from "../model/user.model";
import {FontAwesome} from "@expo/vector-icons";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {successToast} from "../components/toast";
import {useAppDispatch, useAppSelector} from "../api/store";
import {logout} from "../api/authentification/authentication.reducer";
import {Controller, useForm} from "react-hook-form";
import {reset, saveAccountSettings} from "../api/settings/settings.reducer";
import PhoneInput from "react-native-phone-number-input";
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
type MenuItem = {
    title: string;
    icon: string;
    color?: ColorValue | number | undefined;
    notif?: boolean
    type?: 'account' | 'notif' | 'plus',
    action?: Function
};

export default function ProfilScreen({navigation}) {
    const dispatch = useAppDispatch();
    const {showActionSheetWithOptions} = useActionSheet();
    const account = useAppSelector(state => state.authentification.account);
    const successMessage = useAppSelector(state => state.settings.successMessage);
    const phoneInput = useRef<PhoneInput>(null);
    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
            phoneNumber: account?.phoneNumber
        }
    });
    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ['100%', '80%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);


    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, []);


    useEffect(() => {
        if (successMessage) {
            dispatch(reset());
            successToast('Enregistrement avec succès', 'Enregistrement des vos informations avec succès');
        }
    }, [successMessage]);


    const languageOptions = ["Francais", "Anglais", "Annuler"];
    const [user, setUser] = useState<IUser>({firstName: "Maboma", lastName: "Brenda", email: "brenda@maboma.fr"});
    const [accountItems, setAccountItems] = useState<MenuItem[]>([
        {
            title: 'Mon compte',
            icon: 'person',
            color: Colors.light.sekhmetGreen,
            action() {
                bottomSheetModalRef.current.present();
            }
        },
        {
            title: 'Mon Adresse',
            icon: 'location-on',
            color: Colors.light.sekhmetGreen
        }
    ]);

    const [notificationItems, setNotificationItems] = useState<MenuItem[]>([
        {
            title: 'Push Notification',
            icon: 'notifications',
            color: Colors.light.sekhmetGreen,
            notif: false,
            type: "notif"
        },
        {
            title: 'Notification Promo',
            icon: 'notifications',
            color: Colors.light.sekhmetGreen,
            notif: true,
            type: "notif"
        }
    ]);

    const [plusItems, setPlusItems] = useState<MenuItem[]>([
        {
            title: 'Langue',
            icon: 'language',
            color: Colors.light.sekhmetGreen,
            action() {
                openLanguageActionMenu();
            }
        },
        {
            title: 'A propos de sekhmet',
            icon: 'info',
            color: Colors.light.sekhmetGreen
        },
        {
            title: 'Deconnexion',
            icon: 'logout',
            color: Colors.light.sekhmetOrange,
            action() {
                dispatch(logout());
            }
        }
    ]);
    const action = (item) => {
        if (item.action) {
            item.action();
        }
    };

    const onChangeAvatar = () => {

    }
    const onSave = (values) => {
        bottomSheetModalRef.current.close();
        dispatch(
            saveAccountSettings({
                ...account,
                ...values,
            })
        );
    }

    const setChecked = (id: string) => {
        const newList = notificationItems.map((item) => {
            if (item.title === id) {
                const updatedItem: MenuItem = {
                    ...item,
                    notif: !item.notif,
                };
                return updatedItem;
            }
            return item;
        });

        setNotificationItems(newList);
    }

    const renderRow = ({item}: { item: MenuItem }) => {
        return (
            <ListItem
                bottomDivider
                onPress={() => action(item)}>
                <Icon color={item.color} name={item.icon}/>
                <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                {!item.type && <ListItem.Chevron/>}
                {item.type && <Switch value={item.notif} onValueChange={(value) => setChecked(item.title)}/>}
            </ListItem>
        );
    };


    const openLanguageActionMenu = () => {
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options: languageOptions,
                cancelButtonIndex
            },
            onLanguageActionPress
        );
    };

    const onLanguageActionPress = (index) => {
        if (index !== 2) {
            successToast('Langue enregistré', `votre choix de langue ${languageOptions[index]} a été pris en compte`);
        }
    };


    const getAccountModal = () => {

        return <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            style={{shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 11,
                },
                shadowOpacity: 0.57,
                shadowRadius: 15.19,

                elevation: 23}}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <SafeAreaView>
                <ScrollView
                    style={{ padding: 20, backgroundColor: 'white',borderRadius: 10,borderColor: 'black'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <View
                        style={
                            {
                                paddingVertical: 10
                            }
                        }>
                        <View
                            style={styles.row}>
                            <Avatar
                                size={60}
                                rounded
                                source={require("../assets/images/photoprofil.png")}
                                containerStyle={
                                    {
                                        borderColor: 'grey',
                                        borderStyle: 'solid',
                                        borderWidth: 1,
                                    }
                                }/>
                            <Pressable onPress={handleSubmit(onSave)}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Enregistrer</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/*For first name*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>
                            Nom</Text>
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
                                    placeholder="Nom"
                                    underlineColorAndroid="transparent"
                                />
                            )}
                            name="firstName"
                        />
                        {errors.firstName && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>

                    {/*    For lastname*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                            Prénom</Text>
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

                    {/*    For email*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>
                            Email</Text>
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
                                    placeholder="Adresse Email"
                                    underlineColorAndroid="transparent"
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>

                    {/*    For Telephone*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Numéro
                            de telephone</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <PhoneInput
                                    defaultCode="CM"
                                    placeholder="N° de téléphone"
                                    textContainerStyle={{backgroundColor: 'transparent'}}
                                    textInputStyle={{backgroundColor: 'transparent', fontSize: 14}}
                                    layout="first"
                                    ref={phoneInput}
                                    defaultValue={value}
                                    onChangeFormattedText={onChange}
                                    containerStyle={{
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3
                                    }}
                                    countryPickerProps={{withAlphaFilter: true}}
                                />
                            )}
                            name="phoneNumber"
                        />
                        {errors.phoneNumber && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </BottomSheetModal>
    }
    return (
        <View style={{backgroundColor: '#eaeaea', flex: 1}}>

            <SafeAreaView>
                <View style={{paddingVertical: 10, alignItems: 'center', backgroundColor: '#eaeaea',}}>
                    <Avatar
                        size={80}
                        rounded
                        source={require("../assets/images/photoprofil.png")}
                        containerStyle={{
                            borderColor: 'grey',
                            borderStyle: 'solid',
                            borderWidth: 1,
                        }}
                    />
                    <Badge
                        value={<FontAwesome style={{color: 'white',}} size={10} name="pencil"/>}
                        badgeStyle={styles.pencilContainer}
                    />

                    <Text style={{
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 4,
                        fontSize: 18
                    }}>{`${account?.firstName} ${account?.lastName}`}</Text>
                    <Text style={{textAlign: 'center', marginBottom: 4, fontSize: 12}}>+237 691 380 458</Text>
                </View>
                <View style={{backgroundColor: 'white', borderTopLeftRadius: 33, borderTopRightRadius: 33}}>
                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={styles.titleMenu}>Mon Compte</Text>
                        <FlatList
                            data={accountItems}
                            renderItem={renderRow}
                            keyExtractor={item => item.title}/>
                    </View>

                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={styles.titleMenu}>Notifications</Text>
                        <FlatList
                            data={notificationItems}
                            renderItem={renderRow}
                            keyExtractor={item => item.title}/>
                    </View>

                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={styles.titleMenu}>Plus</Text>
                        <FlatList
                            data={plusItems}
                            renderItem={renderRow}
                            keyExtractor={item => item.title}/>
                    </View>
                </View>
            </SafeAreaView>
            {getAccountModal()}

        </View>
    )
}


const styles = StyleSheet.create({
    titleMenu: {
        fontSize: 20,
        margin: 20,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        width: '100%'
    },
    pencilContainer: {
        backgroundColor: Colors.light.sekhmetOrange,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: 'white',
        position: 'absolute',
        left: 18,
        top: -23,
    }
});

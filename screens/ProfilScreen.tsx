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
import React, {useState} from "react";
import Colors from "../constants/Colors";
import Modal from 'react-native-modal';
import {IUser} from "../model/user.model";
import {FontAwesome} from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import {useActionSheet} from "@expo/react-native-action-sheet";

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

export default function ProfilScreen() {
    // const navigation = useNavigation();

    // const saveData = async () => {
    //     navigation.
    // }
    const {showActionSheetWithOptions} = useActionSheet();
    const showToast = (type: string, title: string, message: string) => {
        Toast.show({
            type: type,
            text1: title,
            position: 'bottom',
            text2: message
        });
    }
    const languguageOptions = ["Francais", "Anglais", "Annuler"];
    const successToast = (succuessTitle: string, successMessage: string) => {
        showToast('success', succuessTitle, successMessage);
    }

    const [openAccountModal, setOpenAccountModal] = useState(false);
    const [user, setUser] = useState<IUser>({firstName: "Maboma", lastName: "Brenda", email: "brenda@maboma.fr"});
    const [accountItems, setAccountItems] = useState<MenuItem[]>([
        {
            title: 'Mon compte',
            icon: 'person',
            color: Colors.light.sekhmetGreen,
            action() {
                setOpenAccountModal(open => !open);
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
        }
    ]);
    const action = (item) => {
        if (item.action) {
            item.action();
        }
    };

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
                onPress={() => action(item)}
            >
                <Icon color={item.color} name={item.icon}/>
                <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                {!item.type && <ListItem.Chevron/>}
                {item.type && <Switch value={item.notif} onValueChange={(value) => setChecked(item.title)}/>}
            </ListItem>
        );
    };

    const onChangeAvatar = () => {

    }
    const onSave = () => {
        setOpenAccountModal(false);
        successToast('Enregistrement avec succès', 'Enregistrement des vos informations avec succès');
    }

    const getAccountModal = () => {

        return <Modal
            avoidKeyboard
            onBackdropPress={() => setOpenAccountModal(false)}
            animationIn={"slideInUp"}
            isVisible={openAccountModal}
            swipeDirection={['down', 'up'
            ]
            }
            onSwipeComplete={() => setOpenAccountModal(false)}>

            <SafeAreaView>
                <ScrollView
                    style={
                        {
                            padding: 20, backgroundColor: 'white'
                        }
                    }
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
                            <Pressable onPress={onSave}>
                                <Text style={{color: Colors.light.sekhmetGreen}}>Enregistrer</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/*For first name*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>
                            Nom</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={firstName => {
                                const neUser = {...user, firstName};
                                setUser(neUser);
                            }}
                            value={user.firstName}
                            placeholder="Nom"
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    {/*    For lastname*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                            Prénom</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={lastName => {
                                const neUser = {...user, lastName};
                                setUser(neUser);
                            }}
                            value={user.lastName}
                            placeholder="Prénom"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    {/*    For email*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Numéro
                            de telephone</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={phoneNumber => {

                            }}
                            value={'+237 691 380 458'}
                            placeholder="Adresse Email"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    {/*    For email*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>
                            Email</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'grey',
                                borderWidth: 0.5,
                                borderRadius: 3,
                                paddingHorizontal: 8
                            }}
                            onChangeText={email => {
                                const neUser = {...user, email};
                                setUser(neUser);
                            }}
                            value={user.email}
                            placeholder="Adresse Email"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
            ;
    }

    const openLanguageActionMenu = () => {
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options: languguageOptions,
                cancelButtonIndex
            },
            onLanguageActionPress
        );
    };


    const onLanguageActionPress = (index) => {
        if (index !== 2) {
            successToast('Langue enregistré', `votre choix de langue ${languguageOptions[index]} a été pris en compte`);
        }
    };
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

                    <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 4, fontSize: 18}}>Brenda
                        Maboma</Text>
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

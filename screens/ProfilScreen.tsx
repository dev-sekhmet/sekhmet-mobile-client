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
import {Avatar, Icon, ListItem, Switch} from "react-native-elements";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import Modal, {ModalContent, ScaleAnimation,     ModalTitle,
    ModalFooter,
    ModalButton,
    SlideAnimation,
    BottomModal,
    ModalPortal,} from 'react-native-modals';

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

    const [openAccountModal, setOpenAccountModal] = useState(false);
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
            color: Colors.light.sekhmetGreen
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

    }

    const getAccountModal = () => {
        return <Modal
            onTouchOutside={() => {
                setOpenAccountModal(false);
            }}
            width={0.97}
            visible={openAccountModal}
            onSwipeOut={() => setOpenAccountModal(false)}
            modalAnimation={new ScaleAnimation()}
            onHardwareBackPress={() => {
                setOpenAccountModal(false);
                return true;
            }}>
            <ModalContent>
                <SafeAreaView>
                    <ScrollView style={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}>
                        <View style={{paddingVertical: 10, alignItems: 'flex-start'}}>
                            <View style={styles.row}>
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

                                    <Pressable onPress={onChangeAvatar}>
                                        <Text>Change Avatar</Text>
                                    </Pressable>

                                    <Pressable onPress={onSave}>
                                        <Text>Save</Text>
                                    </Pressable>

                            </View>
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
                    </ScrollView>
                </SafeAreaView>
            </ModalContent>
        </Modal>;
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
        justifyContent: 'space-evenly',
        alignItems:"center"
    }
});

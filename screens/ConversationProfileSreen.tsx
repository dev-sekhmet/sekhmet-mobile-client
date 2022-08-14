import {TwilioProps} from "../types";
import {Text, View} from "../components/Themed";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import ProfilAvatar from "../components/ProfilAvatar";
import React, {useEffect, useState} from "react";
import Colors from "../constants/Colors";
import {Conversation, Participant} from "@twilio/conversations";
import {IUser} from "../model/user.model";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";
import Moment from "moment";
import {useAppSelector} from "../api/store";
import {AntDesign} from "@expo/vector-icons";
import UserItem from "../components/UserItem";
import {CONVERSATION_TYPE} from "../constants/constants";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function ConversationProfileSreen({route, navigation, twilioClient}: TwilioProps) {
    const conversations = useAppSelector(state => state.convos);
    const participantsList = useAppSelector(state => state.participants);
    const [conversation, setConversation] = useState<Conversation>(conversations.find(c => c.sid === route.params.clickedConversation.sid));
    const [participants, setParticipants] = useState<Participant[]>(participantsList.find(c => c.channelSid === route.params.clickedConversation.sid).participants);
    const [allParticipants, setAllParticipants] = useState<IUser[]>([]);


    const mapParticipantToIUser = (p: Participant) => {
        return {
            id: p.attributes['id'],
            firstName: p.attributes['firstName'],
            lastName: p.attributes['lastName'],
            imageUrl: p.attributes['imageUrl'],
        };
    }

    useEffect(() => {
        const iUsers = participants.map(p => {
            return mapParticipantToIUser(p);
        });
        setAllParticipants(iUsers);
    }, [participants]);
    const pickImage = async () => {

    }
    if (!conversation || !conversation.sid) {
        return <SekhmetActivityIndicator/>;
    }
    const onChangeSearch = (searchQuery) => {
        console.log("searchQuery participant", searchQuery);
    }

    const addParticipant = (event) => {
        console.log("addParticipant", event);
    }
    const selectedUser = (event) => {
        console.log("addParticipant", event);
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{paddingVertical: 10, alignItems: 'center', backgroundColor: '#eaeaea'}}>
                <ProfilAvatar
                    size={height < 670 ? 45 : 80}
                    key={conversation.sid}
                    title={conversation.friendlyName}
                    imageUrl={null}
                    badge={{styles: styles.pencilContainer}}
                    onPress={pickImage}
                />
                <Text style={{
                    textAlign: 'center',
                    marginTop: 5,
                    marginBottom: 4,
                    fontSize: 18
                }}>{conversation.friendlyName}</Text>
            </View>
            <View style={styles.adminContainer}>
                <View style={{flexDirection: "row", backgroundColor: 'transparent'}}>
                    <TouchableOpacity style={styles.card}>
                        <Text
                            style={[styles.number, {color: Colors.light.sekhmetGreen}]}>{Moment(conversation.dateCreated).calendar()}</Text>
                        <Text style={{color: Colors.light.colorTextGrey}}>Date Creation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.card]}>
                        <Text
                            style={[styles.number, {color: Colors.light.sekhmetGreen}]}>{participants.length}</Text>
                        <Text style={{color: Colors.light.colorTextGrey}}>Participants</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.card]}>
                        <Text style={[styles.number, {color: Colors.light.sekhmetGreen}]}>Voir médias</Text>
                        <Text style={[{color: Colors.light.colorTextGrey, fontSize: 10}]}>Liens, Images, docs</Text>
                    </TouchableOpacity>
                </View>
                {/*@ts-ignore */}
                <View style={{textAlign: 'justify', margin: 10, backgroundColor: 'transparent'}}>
                    <Text>In publishing and graphic design, Lorem ipsum is a a typeface without relying on meaningful
                        content. Lorem ipsum may be used as a placeholder before final copy is available</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder={'Cherchez un participant'}
                    onChangeText={onChangeSearch}
                />
                <TouchableOpacity style={[styles.ajouterButton]} onPress={() => addParticipant(null)}>
                    <AntDesign name="plus" size={24} color="black"/>
                    <Text style={{marginLeft: 10, color: Colors.light.colorTextGrey}}>Ajouter un Participant</Text>
                </TouchableOpacity>
                <FlatList
                    style={styles.inputText}
                    data={allParticipants}
                    renderItem={({item}) => (
                        <UserItem
                            item={item}
                            execSelection={selectedUser}
                            creationType={CONVERSATION_TYPE.GROUP}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    adminContainer: {
        flex: 1,
        backgroundColor: '#F9F8FD'
    },
    card: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: 'center',
        marginHorizontal: "1%",
        margin: 10,
        alignItems: 'center'
    },
    number: {
        marginTop: 10,
        fontSize: 15
    },
    fontCommon: {
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25
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
    },
    inputText: {
        height: 30,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        margin: 10,
        fontSize: 16,
    },
    ajouterButton: {
        flex: 1,
        padding: 5,
        borderRadius: 10,
        maxHeight: height * 0.05,
        flexDirection: 'row', justifyContent: 'center',
        backgroundColor: "white",
        marginHorizontal: "2%",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        alignItems: 'center'
    }
});

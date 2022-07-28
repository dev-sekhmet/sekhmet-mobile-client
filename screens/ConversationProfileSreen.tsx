import {TwilioProps} from "../types";
import {Text, View} from "../components/Themed";
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import ProfilAvatar from "../components/ProfilAvatar";
import React, {useEffect, useState} from "react";
import Colors from "../constants/Colors";
import {Conversation, Participant} from "@twilio/conversations";
import SekhmetActivityIndicator from "../components/SekhmetActivityIndicator";
import Moment from "moment";
import {useAppSelector} from "../api/store";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function ConversationProfileSreen({route, navigation, twilioClient}: TwilioProps) {
    const conversations = useAppSelector(state => state.convos);
    const participantsList = useAppSelector(state => state.participants);
    const [conversation, setConversation] = useState<Conversation>(conversations.find(c => c.sid === route.params.clickedConversation.sid));
    const [participants, setParticipants] = useState<Participant[]>(participantsList.find(c => c.channelSid === route.params.clickedConversation.sid).participants);

    const pickImage = async () => {

    }
    if (!conversation || !conversation.sid) {
        return <SekhmetActivityIndicator/>;
    }

    return (
        <View style={{backgroundColor: '#eaeaea', flex: 1, height: height}}>

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
                <View style={styles.admincontainer}>
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
                            <Text style={[{color: Colors.light.colorTextGrey, fontSize:10}]}>Liens, Images, docs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    admincontainer: {
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
        alignItems: 'center',

    },
    ajouterButton: {
        flex: 1,
        padding: 5,
        borderRadius: 10,
        maxHeight: height * 0.05,
        flexDirection: 'row', justifyContent: 'center',
        backgroundColor: "white",
        marginHorizontal: "2%",
        margin: 10,
        marginTop: 15,
        alignItems: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.57,
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
    }
});

import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import {FontAwesome, FontAwesome5, Ionicons} from '@expo/vector-icons';
import {useActionSheet} from '@expo/react-native-action-sheet';
import AudioPlayer from './media/AudioPlayer';
import MessageReply from './MessageReply';
import {Text, View} from "./Themed";
import Moment from 'moment';
import {Media, User} from "@twilio/conversations";
import {forkJoin, from, map,} from "rxjs";
import {transparent} from "react-native-paper/lib/typescript/styles/colors";
import VideoPlayer from "./media/video/VideoPlayer";
import ImageView from "./media/ImageView";
import {APP_TIME_FORMAT} from "../constants/constants";
import {Message} from "../types";
import Colors from "../constants/Colors";

const grey = '#F2F2F2';
const blue = '#ECF3FE';
type MediaType = 'image' | 'video' | 'audio' | 'file';
type MediaData = { sid: string, type: MediaType, url: string };
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const MessageBox = (props: { navigation?: any, message: Message, authUser?: User, setAsMessageReply?: () => void }) => {
    const {setAsMessageReply, message: propMessage, authUser} = props;

    const [message, setMessage] = useState<Message>(propMessage);
    const [repliedTo, setRepliedTo] = useState<Message | undefined>(
        undefined
    );
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [soundURI, setSoundURI] = useState<any>(null);
    const {showActionSheetWithOptions} = useActionSheet();
    const [mediaContents, setMediaContents] = useState<MediaData[]>([]);

    useEffect(() => {
        setMessage(propMessage);

    }, [propMessage]);

    useEffect(() => {
        // subscription to websocket chat
        /*  const subscription = DataStore.observe(MessageModel, message.id).subscribe(
              (msg) => {
                  if (msg.model === MessageModel) {
                      if (msg.opType === "UPDATE") {
                          setMessage((message) => ({ ...message, ...msg.element }));
                      } else if (msg.opType === "DELETE") {
                          setIsDeleted(true);
                      }
                  }
              }
          );

          return () => subscription.unsubscribe();*/
    }, []);

    useEffect(() => {
        setAsRead();
    }, [isMe, message]);

    const msg = message.msg;
    useEffect(() => {
        if (msg.attachedMedia) {
            forkJoin(msg.attachedMedia.map(value => {
                return from<Promise<string | null>>(value.getContentTemporaryUrl())
                    .pipe(map(url => {
                        const res: MediaData = {sid:value.sid, type: 'file', url}
                        if (value.contentType?.includes("image")) {
                            res.type = 'image';
                        }
                        if (value.contentType?.includes("audio")) {
                            res.type = 'audio';
                        }
                        if (value.contentType?.includes("video")) {
                            res.type = 'video';
                        }
                        return res;
                    }))
            })).subscribe(medias => {
                setMediaContents(medias);
            });
        }
        const checkIfMe = async () => {
            if (!message.msg.author) {
                return;
            }
            setIsMe(message.msg.author === authUser.identity);
        };
        checkIfMe();
        if (!msg?.body) {
            return;
        }

    }, [message]);


    const setAsRead = async () => {
        if (isMe === false && message) {
            // if (isMe === false && message.read) {

            /*            await DataStore.save(
                            MessageModel.copyOf(message, (updated) => {
                                updated.status = "READ";
                            })
                        );*/
        }
    };

    const deleteMessage = async () => {
        message.msg.remove();
    };


    const confirmDelete = () => {
        if (message.deleted) {
            Alert.alert("Action impossible", "Message déja supprimé");
        } else {
            Alert.alert(
                "Confirmer la Suppression",
                "Voulez-vous vraiment supprimer ce message ?",
                [
                    {
                        text: "Supprimer",
                        onPress: deleteMessage,
                        style: "destructive",
                    },
                    {
                        text: "Cancel",
                    },
                ]
            );
        }

    };

    const onActionPress = (index) => {
        if (index === 0) {
            setAsMessageReply();
        } else if (index === 1) {
            if (isMe) {
                confirmDelete();
            } else {
                Alert.alert("Action impossible", "Ceci n'est pas votre message");
            }
        }
    };

    const openActionMenu = () => {
        const options = ["Repondre", "Supprimer", "Annuler"];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            onActionPress
        );
    };
    const getFileUrl = async (media: Media): Promise<string> => {
        return await media.getContentTemporaryUrl().then();
    };
    if (!message.msg.author) {
        return <ActivityIndicator/>;
    }


    return (
        <Pressable
            onLongPress={openActionMenu}
        >
            <View
                style={[
                    styles.container,
                    isMe ? styles.rightContainer : styles.leftContainer,
                    {width:  "auto"},
                ]}>
                {!isMe && <Text style={styles.author}>
                    {message.author}
                </Text>}
                {repliedTo && <MessageReply message={repliedTo}/>}
                <View style={styles.row}>
                    {msg.type === 'media' && msg.attachedMedia && (
                        <FlatList
                            data={mediaContents}
                            renderItem={({item, index}) => (
                                <View style={{marginBottom: msg.body ? 10 : 0}}>
                                    {item.type === 'image' ? <ImageView
                                            uri={item.url}
                                            navigator={props.navigation}
                                            style={{
                                                minHeight: height*0.1,
                                                minWidth: width*0.5
                                            }}/>
                                        :
                                        item.type === 'audio' ?
                                            <AudioPlayer soundURI={item.url}/> :
                                            item.type === 'video' ?
                                                <VideoPlayer
                                                    style={{
                                                    minHeight: 150,
                                                    minWidth: 150
                                                }} uri={item.url}/> :
                                                <Text>FILE</Text>
                                    }
                                    {/* <Ionicons
                                        name={"attach"}
                                        size={20}
                                        color="gray"
                                        style={{marginHorizontal: 5}}
                                    />*/}
                                </View>
                            )}
                            keyExtractor={item => item.sid}
                            inverted
                        />

                    )}
                    {!!msg.body && (
                        <View>
                            {message.deleted && <View style={{flexDirection: "row",
                                alignItems:'center',
                                backgroundColor: isMe ? blue : grey}}>
                                <FontAwesome5 size={10} name="ban"/>
                                <Text style={{fontStyle: 'italic', marginLeft:3}}>
                                    ce message a été supprimé
                                </Text>
                            </View>}
                            {!message.deleted && <Text style={{backgroundColor: isMe ? blue : grey}}>
                                {msg.body}
                            </Text>}
                        </View>)
                    }
                </View>
            </View>
            <Text style={[
                isMe ? styles.rightHour : styles.leftHour,
                {width: soundURI ? "75%" : "auto"},
            ]}>{Moment(msg.dateUpdated).format(APP_TIME_FORMAT)}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,

        maxWidth: "75%",
    }, containerHour: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        maxWidth: "75%",
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    messageReply: {
        backgroundColor: "gray",
        padding: 5,
        borderRadius: 5,
    },
    leftContainer: {
        backgroundColor: grey,
        marginLeft: 10,
        marginRight: "auto",
    },
    leftHour: {
        marginLeft: 10,
        color: '#8C8C8C',
        marginRight: "auto",
    },
    rightContainer: {
        backgroundColor: blue,
        marginLeft: "auto",
        marginRight: 10,
        alignItems: "flex-end",
    },
    rightHour: {
        marginLeft: "auto",
        marginRight: 10,
        color: '#8C8C8C',
        alignItems: "flex-end",
    },
    author: {
        color: Colors.light.sekhmetOrange,
        fontWeight: "bold",
    }
});

export default MessageBox;
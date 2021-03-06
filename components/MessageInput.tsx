import React, {useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View,} from 'react-native';
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons,} from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import {Audio} from 'expo-av';
import AudioPlayer from './media/AudioPlayer';
import MessageBox from './MessageBox';
import {useNavigation} from '@react-navigation/core';
import Colors from "../constants/Colors";
import {Conversation, Message} from "@twilio/conversations";
import {ImageInfo, ImagePickerCancelledResult} from "expo-image-picker";
import VideoPlayer from "./media/video/VideoPlayer";


const MessageInput = ({
                          conversation,
                          messageReplyTo,
                          removeMessageReplyTo
                      }: { conversation: Conversation, messageReplyTo: Message, removeMessageReplyTo: () => void }) => {
    const [message, setMessage] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [soundURI, setSoundURI] = useState<string | null>(null);
    const [videoURI, setVideoURI] = useState<string | null>(null);

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const libraryResponse =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
                await Audio.requestPermissionsAsync();

                if (
                    libraryResponse.status !== "granted" ||
                    photoResponse.status !== "granted"
                ) {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        })();
    }, []);

    const sendMessageToUser = async (user, fromUserId) => {
        // send message
        /*  const ourSecretKey = await getMySecretKey();
          if (!ourSecretKey) {
              return;
          }

          if (!user.publicKey) {
              Alert.alert(
                  "The user haven't set his keypair yet",
                  "Until the user generates the keypair, you cannot securely send him messages"
              );
              return;
          }

          console.log("private key", ourSecretKey);

          const sharedKey = box.before(
              stringToUint8Array(user.publicKey),
              ourSecretKey
          );
          console.log("shared key", sharedKey);

          const encryptedMessage = encrypt(sharedKey, { message });
          console.log("encrypted message", encryptedMessage);

          const newMessage = await DataStore.save(
              new Message({
                  content: encryptedMessage, // <- this messages should be encrypted
                  userID: fromUserId,
                  forUserId: user.id,
                  chatroomID: chatRoom.id,
                  replyToMessageID: messageReplyTo?.id,
              })
          );
  */
        // updateLastMessage(newMessage);
    };

    const sendMessage = async () => {
        conversation.sendMessage(message);
    };

    const updateLastMessage = async (newMessage) => {
        /*DataStore.save(
            ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
                updatedChatRoom.LastMessage = newMessage;
            })
        );*/
    };

    const onPlusClicked = () => {
        // console.warn("On plus clicked");
    };

    const onPress = () => {
        if (videoURI) {
            sendVideo();
        }
        if (image) {
            sendImage();
        } else if (soundURI) {
            sendAudio();
        } else if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
        resetFields();
        conversation.setAllMessagesRead();
    };

    const resetFields = () => {
        setMessage("");
        setIsEmojiPickerOpen(false);
        setImage(null);
        setProgress(0);
        setSoundURI(null);
        setVideoURI(null);
        removeMessageReplyTo();
    };

    const setImageOrVideoUri = (result: ImageInfo) => {
        if (!result.cancelled) {
            if (result.type === 'video') {
                setVideoURI(result.uri);
            }
            if (result.type === 'image') {
                setImage(result.uri);
            }
        }
    }

// Image picker
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        console.log("result", result);
        // @ts-ignore
        setImageOrVideoUri(result);
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
        });
        // @ts-ignore
        setImageOrVideoUri(result);
    };

    const progressCallback = (progress) => {
        setProgress(progress.loaded / progress.total);
    };

    const buildFileInfo = (fileType, file) => {
        const filename = file.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        console.log("match", match);
        const type = match ? `${fileType}/${match[1]}` : `${fileType}`;
        return {filename, type};
    }

    const sendImage = async () => {
        if (!image) {
            return;
        }
        const fileData = new FormData();
        let {filename, type} = buildFileInfo("image", image);
        // @ts-ignore
        fileData.append("image", {uri: image, name: filename, type});
        conversation.sendMessage(fileData);
    };

    async function startRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log("Starting recording..");
            const {recording} = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            console.log("Recording started");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        console.log("Stopping recording..");
        if (!recording) {
            return;
        }

        setRecording(null);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);
        if (!uri) {
            return;
        }
        setSoundURI(uri);
    }

    const sendAudio = async () => {
        if (!soundURI) {
            return;
        }
        const fileData = new FormData();
        let {filename, type} = buildFileInfo("audio", soundURI);
        // @ts-ignore
        fileData.append("audio", {uri: soundURI, name: filename, type});
        conversation.sendMessage(fileData);
    };

    const sendVideo = async () => {
        if (!videoURI) {
            return;
        }
        const fileData = new FormData();
        let {filename, type} = buildFileInfo("video", videoURI);
        // @ts-ignore
        fileData.append("video", {uri: videoURI, name: filename, type});
        conversation.sendMessage(fileData);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.root, {height: isEmojiPickerOpen ? "50%" : "auto"}]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            {messageReplyTo && (
                <View
                    style={{
                        backgroundColor: "#f2f2f2",
                        padding: 5,
                        flexDirection: "row",
                        alignSelf: "stretch",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{flex: 1}}>
                        <Text>Reply to:</Text>
                        <MessageBox message={messageReplyTo}/>
                    </View>
                    <Pressable onPress={() => removeMessageReplyTo()}>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            style={{margin: 5}}
                        />
                    </Pressable>
                </View>
            )}

            {image && (
                <View style={styles.sendImageContainer}>
                    <Image
                        source={{uri: image}}
                        style={{width: 100, height: 100, borderRadius: 10}}
                    />

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignSelf: "flex-end",
                        }}
                    >
                        <View
                            style={{
                                height: 5,
                                borderRadius: 5,
                                backgroundColor: "#3777f0",
                                width: `${progress * 100}%`,
                            }}
                        />
                    </View>

                    <Pressable onPress={() => setImage(null)}>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            style={{margin: 5}}
                        />
                    </Pressable>
                </View>
            )}

            {soundURI && <AudioPlayer soundURI={soundURI}/>}
{/*            {videoURI && <VideoPlayer
                style={{
                    minHeight: 150,
                    minWidth: 150
                }} uri={videoURI}/>}*/}

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Pressable
                        onPress={() =>
                            setIsEmojiPickerOpen((currentValue) => !currentValue)
                        }
                    >
                        <SimpleLineIcons
                            name="emotsmile"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Votre message..."
                    />

                    <Pressable onPress={pickImage}>
                        <Feather
                            name="image"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable onPress={takePhoto}>
                        <Feather
                            name="camera"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                        <MaterialCommunityIcons
                            name={recording ? "microphone" : "microphone-outline"}
                            size={24}
                            color={recording ? "red" : "#595959"}
                            style={styles.icon}
                        />
                    </Pressable>
                </View>

                <Pressable onPress={onPress} style={styles.buttonContainer}>
                    {message || image || videoURI || soundURI ? (
                        <Ionicons name="send" size={18} color={"white"}/>
                    ) : (
                        <AntDesign name="plus" size={24} color="white"/>
                    )}
                </Pressable>
            </View>

            {isEmojiPickerOpen && (
                <EmojiSelector
                    onEmojiSelected={(emoji) =>
                        setMessage((currentMessage) => currentMessage + emoji)
                    }
                    columns={8}
                />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 10,
    },
    row: {
        flexDirection: "row",
    },
    inputContainer: {
        backgroundColor: "#f2f2f2",
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#dedede",
        alignItems: "center",
        flexDirection: "row",
        padding: 5,
    },
    input: {
        flex: 1,
        marginHorizontal: 5,
    },
    icon: {
        marginHorizontal: 5,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: Colors.light.sekhmetGreen,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 35,
    },

    sendImageContainer: {
        flexDirection: "row",
        marginVertical: 10,
        alignSelf: "stretch",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
    },
});

export default MessageInput;
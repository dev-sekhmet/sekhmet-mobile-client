import React, {useCallback, useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {View} from '../components/Themed';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import imageIcon from '../images/image.png';
import {ImageLibraryOptions} from "react-native-image-picker/src/types";
import {GiftedChat} from "react-native-gifted-chat/src/GiftedChat";

export default function Chat(props: any) {
  const {navigation} = props;

  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>({});
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (selectedConversation) {
      // get list of messages.
      loadMessages();
      // listen for messages.
      listenForMessages();
      // listen for online users.
      listenForOnlineUsers();
    }
    return () => {
      if (selectedConversation) {
        const conversationId = selectedConversation && selectedConversation.guid ? selectedConversation.guid : selectedConversation.uid ? selectedConversation.uid : null;
        if (conversationId) {
          //  cometChat.removeMessageListener();
        }
        setMessages(() => []);
        // cometChat.removeUserListener(userOnlineListenerId);
      }
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedFile && selectedFile.name && selectedFile.uri) {
      sendMediaMessageCometChat();
    }
  }, [selectedFile]);

  const isValidMessage = (message: any) => {
    return message &&
      message.id &&
      message.sentAt &&
      message.sender &&
      message.sender.uid &&
      message.sender.name &&
      message.sender.avatar &&
      message.category &&
      message.category === 'message'
  };

  const transformSingleMessage = (message: any) => {
    if (isValidMessage(message)) {
      let transformedMessage: any = {
        _id: message.id,
        createdAt: new Date(message.sentAt * 1000),
        user: {
          _id: message.sender.uid,
          name: message.sender.name,
          avatar: message.sender.avatar,
        },
      }
      if (message.text) {
        transformedMessage.text = message.text;
      }
      if (message.data && message.data.url) {
        if (message.type && message.type === 'video') {
          transformedMessage.video = message.data.url;
        } else {
          transformedMessage.image = message.data.url;
        }
      }
      return transformedMessage;
    }
    return message;
  };

  const transformMessages = (messages: any[]) => {
    if (messages && messages.length !== 0) {
      const transformedMessages = [];
      for (const message of messages) {
        if (isValidMessage(message)) {
          transformedMessages.push(transformSingleMessage(message));
        }
      }
      return transformedMessages.sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return [];
  };

  const renderChatHeaderTitle = (onlineUser: any) => {
    if (onlineUser && onlineUser.name) {
      return (
        <View style={styles.chatHeaderTitleContainer}>
          <Text style={styles.chatHeaderTitle}>{onlineUser.name}</Text>
          {onlineUser.status &&
          <Text style={[styles.chatHeaderTitle, styles.chatHeaderStatus]}> - {onlineUser.status}</Text>}
        </View>
      );
    }
    return <Text style={styles.chatHeaderTitle}>Chat</Text>;
  };

  const listenForOnlineUsers = () => {
    /*   cometChat.addUserListener(
         userOnlineListenerId,
         new cometChat.UserListener({
           onUserOnline: onlineUser => {
             if (onlineUser && onlineUser.uid === selectedConversation.uid) {
               navigation.setOptions({
                 headerTitle: () => renderChatHeaderTitle(onlineUser),
               })
             }
           },
           onUserOffline: offlineUser => {
             if (offlineUser && offlineUser.uid === selectedConversation.uid) {
               navigation.setOptions({
                 headerTitle: () => renderChatHeaderTitle(offlineUser),
               })
             }
           }
         })
       );*/
  };

  /**
   * listen for messages
   */
  const listenForMessages = () => {
    const conversationId = selectedConversation && selectedConversation.guid ? selectedConversation.guid : selectedConversation.uid ? selectedConversation.uid : null;
    if (conversationId) {
      /*      cometChat.addMessageListener(
              conversationId,
              new cometChat.MessageListener({
                onTextMessageReceived: (message) => {
                  // set state.
                  setMessages(previousMessages => GiftedChat.append(previousMessages, [transformSingleMessage(message)]))
                },
                onMediaMessageReceived: mediaMessage => {
                  // Handle media message
                  // set state.
                  setMessages(previousMessages => GiftedChat.append(previousMessages, [transformSingleMessage(mediaMessage)]))
                },
              })
            );*/
    }
  }

  const loadMessages = () => {
    const limit = 50;
    /* const messageRequestBuilder = new cometChat.MessagesRequestBuilder().setLimit(limit)
     if (selectedConversation.contactType === 1) {
       messageRequestBuilder.setGUID(selectedConversation.guid);
     } else if (selectedConversation.contactType === 0) {
       messageRequestBuilder.setUID(selectedConversation.uid);
     }
     const messagesRequest = messageRequestBuilder
       .setCategories(["message"])
       .build();
     messagesRequest
       .fetchPrevious()
       .then((messages) => {
         setMessages(() => transformMessages(messages));
       })
       .catch((error) => { });*/
  };


  const getReceiverId = () => {
    if (selectedConversation && selectedConversation.guid) {
      return selectedConversation.guid;
    }
    if (selectedConversation && selectedConversation.uid) {
      return selectedConversation.uid;
    }
    return null;
  };

  const getReceiverType = () => {
    if (selectedConversation && selectedConversation.guid) {
      // return cometChat.RECEIVER_TYPE.GROUP;
    }
    // return cometChat.RECEIVER_TYPE.USER;
  };


  const sendMediaMessageCometChat = () => {
    const receiverID = getReceiverId();
    const receiverType = getReceiverType();
    //  const messageType = selectedFile && selectedFile.type && selectedFile.type.includes('video') ? cometChat.MESSAGE_TYPE.VIDEO : cometChat.MESSAGE_TYPE.FILE;

    if (receiverID && receiverType) {
      /*  const mediaMessage = new cometChat.MediaMessage(
          receiverID,
          selectedFile,
          messageType,
          receiverType
        );

        cometChat.sendMediaMessage(mediaMessage).then(
          message => {
            // Message sent successfully.
            const transformedSingleMessage = transformSingleMessage(message);
            setMessages(previousMessages => GiftedChat.append(previousMessages, [transformedSingleMessage]))
          },
          error => {
            // Handle exception.
          }
        );
      }*/
    }
  }

  const sendMessageCometChat = (messages: any[]) => {
    if (messages && messages.length !== 0) {
      const receiverID = getReceiverId();
      const receiverType = getReceiverType();
      if (receiverID && receiverType) {
        /*        const messageText = messages[0].text;
                const textMessage = new cometChat.TextMessage(
                  receiverID,
                  messageText,
                  receiverType
                );
                cometChat.sendMessage(textMessage).then(
                  message => {
                    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
                  },
                  error => {
                  }
                );*/
      }
    }
  }

  const onSend = useCallback((messages = []) => {
    sendMessageCometChat(messages);
  }, []);

  const getFileName = (fileName: any, type: any) => {
    if (Platform.OS === 'android' && type === 'photo') {
      return 'Camera_001.jpeg';
    } else if (Platform.OS === 'android' && type.includes('video')) {
      return 'Camera_001.mov'
    }
    return fileName;
  }

  const handleSelectFile = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed'
    };
    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        return null;
      } else if (response.assets && response.assets.length !== 0) {
        const uri = response.assets[0].uri;
        const fileName = response.assets[0].fileName;
        const type = response.assets[0].type;
        if (uri && fileName) {
          const file = {
            name: getFileName(fileName, type),
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type: type || 'video/quicktime'
          };
          setSelectedFile(() => file);
        }
      }
    });
  };

  const renderActions = () => {
    return (<View style={{flexDirection: 'row', paddingBottom: 12}}>
      <TouchableOpacity style={styles.select} onPress={handleSelectFile}>
        <Image source={imageIcon} style={{width: 24, height: 24}}/>
      </TouchableOpacity>
    </View>);
  };

  const getSource = (message: any) => {
    if (message && message.currentMessage) {
      return message.currentMessage.audio ? message.currentMessage.audio : message.currentMessage.video ? message.currentMessage.video : null;
    }
    return null;
  }

  const renderVideo = (message: any) => {
    const source = getSource(message);
    if (source) {
      return (
        <View style={styles.videoContainer} key={message.currentMessage._id}>
          {Platform.OS === 'ios' ?<div>sss</div> : <div>sss</div>}
        </View>
      );
    }
    return <></>;
  };

  return (

    <View style={{backgroundColor: '#fff', flex: 1}}>
      { <GiftedChat
          scrollToBottom
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: user.uid,
            name: user.name,
            avatar: user.avatar,
          }}
          renderActions={renderActions}
          renderMessageVideo={renderVideo}
        />}
    </View>
  )
};
const styles = StyleSheet.create({
  select: {
    paddingLeft: 8
  },
  videoContainer: {
    position: 'relative',
    height: 156,
    width: 250
  },
  videoElement: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 150,
    width: 242,
    borderRadius: 20,
    margin: 4,
  },
  chatHeaderTitleContainer: {
    flexDirection: 'row'
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  chatHeaderStatus: {
    textTransform: 'capitalize'
  }
});

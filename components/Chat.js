import React, {Component} from 'react';
import {StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
import firebase from 'firebase';
import 'firebase/firestore';

// display data from  Firestore database in the app
const firebaseConfig = {
    apiKey: "AIzaSyAmEWCErAmp3BsJ1SiFTHkrShEIsKyW2mw",
  authDomain: "chatapp2-85bc7.firebaseapp.com",
  projectId: "chatapp2-85bc7",
  storageBucket: "chatapp2-85bc7.appspot.com",
  messagingSenderId: "840265275622",
  appId: "1:840265275622:web:f0620fa75f21fc2bcb8327",
  measurementId: "G-5R9VZF8J5G"
};

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
    };
    // initialises connection to Firebase DB
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to all messages in DB
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    // adds user name to header
    const {name} = this.props.route.params;
    this.props.navigation.setOptions({title: `${name}'s Chatroom`});
    // checks user connect
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({isConnected: true});
        console.log('online');
        // authenticates user with firebase
        this.authUnsubscribe = firebase.auth()
          .onAuthStateChanged(async user => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            this.setState({
              uid: user.uid,
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://placeimg.com/140/140/any',
              },
              messages: [],
            });
            // listens for changes to DB
            this.unsubscribe = this.referenceChatMessages
              .orderBy('createdAt', 'desc')
              .onSnapshot(this.onCollectionUpdate);
          });
      } else { console.log('offline');
        this.setState({isConnected: false});
        this.getMessages();
      }
    });
  }

  // unsubscribes from user authentication and DB updates
  componentWillUnmount() {
    this.authUnsubscribe();
   this.unsubscribe();
  }

  // updates messages on client-side when new message added to DB
  onCollectionUpdate = querySnapshot => {
    console.log("kkl");
    const messages = [];
    // goes through each document
    querySnapshot.forEach(doc => {
      // gets QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || null,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  // adds new message to server DB
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // allows offline access to messages retrieved from client-side storage
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // saves new message to client-side storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages),
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // deletes messages from client-side storage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // adds new message to messages array in state
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      },
    );
  }

  // disables message input bar if offline
  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  // displays additional communication features (photos, camera, map)
  renderCustomActions = props => <CustomActions {...props} />;

  // returns custom map view
  renderCustomView = props => {
    const {currentMessage} = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: Number(currentMessage.location.latitude),
            longitude: Number(currentMessage.location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // custom styling for active user's message bubble
  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#008080',
          },
        }}
      />
    );
  };

  render() {
    const {backgroundColour} = this.props.route.params;

    return (
      <View style={[styles.container, {backgroundColor: backgroundColour}]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          renderInputToolbar={this.renderInputToolbar}
          renderUsernameOnMessage={true}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {/* Android keyboard fix */}
        {Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null}
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

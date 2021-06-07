import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View,Alert, Platform, KeyboardAvoidingView, Text, TextInput, Image, TouchableOpacity } from 'react-native';


const Start = props => {
    const [name, setName] = useState('');
    const [backgroundColour, setBackgroundColour] = useState('#fff');
    const colours = ['#090c08', '#474056', '#8a95a5', '#b9c6ae'];

    onPressChat = (name, backgroundColour) => {
      if (name == "") {
        console.log(name);
        return Alert.alert('Please Enter a Name .');

      }
      props.navigation.navigate('Chat', { name, backgroundColour });
    /*  this.props.navigation.navigate("Chat", {
        name: `${name}`,
        backgroundColor: `${backgroundColor}`,
      });*/
    };
    return (
        <ImageBackground source={require('../assets/background-image.png')} style={styles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Chat App</Text>
                </View>
                <View style={styles.startContainer}>
                    <View style={styles.inputContainer}>
                        {/* <Image source={require('../assets/icon.svg')} style={styles.inputIcon} /> */}
                        <TextInput
                            style={styles.nameInput}
                            onChangeText={name => setName(name)}
                            value={name}
                            placeholder="Your Name"
                        />
                    </View>
                    <Text style={styles.chooseColourText}>Choose Background Colour</Text>
                    <View style={styles.colourButtonsContainer}>
                        {colours.map(colour => (
                            <View style={[styles.colourBorder, backgroundColour === colour
                                ? { borderColor: colour }
                                : null]}
                                key={colour}>
                                <TouchableOpacity
                                    onPress={() => setBackgroundColour(colour)}
                                    style={[styles.colourBtn, { backgroundColor: colour }]}
                                    accessible={true}
                                    accessibilityLabel='Background colour options'
                                    accessibilityHint='Choose a background colour for your chat screen'
                                    accessibilityRole='Button'
                                />
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.btnContainer}
                        accessible={true}
                        accessibilityLabel='Start chatting'
                        accessibilityRole='Button'
                    >
                        <Text
                            style={styles.btnText}
                       //   onPress={() => props.navigation.navigate('Chat', { name, backgroundColour })}
                   onPress={() => this.onPressChat(name, backgroundColour)}
      
                        >Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default Start;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    titleContainer: {
        flex: 56,
        justifyContent: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 45,
        fontWeight: '600',
        textAlign: 'center'
    },
    startContainer: {
        margin: '6%',
        padding: '6%',
        backgroundColor: '#fff'
    },
    inputContainer: {
        flexDirection: 'row'
    },
    // inputIcon: {
    //     alignItems: 'center'
    // },
    nameInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        // opacity: 0.5,
        height: 60,
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft: 20
    },
    chooseColourText: {
        justifyContent: 'flex-end',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 1,
        marginTop: 40,
        marginBottom: 20
    },
    colourButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        marginBottom: 30
    },
    colourBtn: {
        height: 50,
        width: 50,
        borderRadius: 25,
        margin: 25
    },
    colourBorder: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: '#fff'
    },
    btnContainer: {
        justifyContent: 'center',
        backgroundColor: '#757083',
        height: 60,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#757083'
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        margin: 'auto'
    }
});
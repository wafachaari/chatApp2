import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
// import react native gesture handler
import 'react-native-gesture-handler';
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default class App extends React.Component {
 
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start"  >
          <Stack.Screen name="Start" component={Start}   options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';

class CustomActions extends Component {
  // handles additional communication features
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.selectImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
        }
      },
    );
  }

  // selects image from device's image library
  selectImage = async () => {
    // requests permission to access image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        // save image to DB if process not cancelled
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // takes photo with device's camera
  takePhoto = async () => {
    // requests permission to access camera and image library
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // gets user location
  getLocation = async () => {
    // requests permission to access user location
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
          .catch(error => console.log(error));
        const latitude = JSON.stringify(result.coords.latitude);
        const longitude = JSON.stringify(result.coords.longitude);
        if (result) {
          this.props.onSend({
            location: {
              latitude,
              longitude
            }
          });
          console.log(latitude);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // uploads images to Firebase in blob format
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      // creates new XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (error) {
        console.log(error);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      // opens connection to retrieve image data
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    // creates unique filenames for Firebase storage
    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    // creates reference to Firebase storage
    const ref = firebase.storage().ref().child(`${imageName}`);
    const snapshot = await ref.put(blob);
    // closes connection
    blob.close();
    // gets image URL from Firebase storage
    return await snapshot.ref.getDownloadURL();
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}
        accessible={true}
        accessibilityLabel='More options'
        accessibilityHint='Choose to send an image from your media library, a photo taken with your camera or your geolocation'
        accessibilityRole='Button'
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
export default CustomActions;
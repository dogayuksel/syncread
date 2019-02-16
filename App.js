/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  NativeEventEmitter,
} from 'react-native';

import Pdf from 'react-native-pdf';
import iCloudStorage from 'react-native-icloudstore';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  componentWillMount() {
    this.eventEmitter = new NativeEventEmitter(iCloudStorage);
    this.eventEmitter.addListener('iCloudStoreDidChangeRemotely', this.loadData);
    this._storeData();
  }

  componentWillUnmount() {
    this.eventEmitter.remove();
  }

  _storeData = async () => {
    try {
      console.log('start storing');
      await iCloudStorage.setItem('MY_STORAGE_KEY', 'I like to save it.');
    } catch (error) {
      console.log("error saving", error);
      // Error saving data
    }
  }

  savePage = async (page) => {
    iCloudStorage.setItem('MY_STORAGE_KEY', `${page}`);
  }

  loadData = (userInfo) => {
    const changedKeys = userInfo.changedKeys;
    console.log('changed keys', changedKeys);
    if (changedKeys != null && changedKeys.includes('MY_STORAGE_KEY')) {
      iCloudStorage.getItem('MY_STORAGE_KEY').then(result => {
        this.setState({ storage: result });
        console.log(result);
      });
    }
  }

  render() {
    const source = {
      uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
      cache: true,
    };
    return (
      <View style={styles.container}>
        <Text>paper</Text>
        <Pdf
          onPageChanged={(page, numberOfPages) => {
              console.log('current', page, numberOfPages);
              this.savePage(page);
          }}
          source={source}
          style={styles.pdf} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  }
});

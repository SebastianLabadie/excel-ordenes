import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
/* 
import * as FS from 'expo-file-system' */

import {StorageAccessFramework} from 'expo-file-system'

export default function TabOneScreen() {

  const fileS = async () =>{

    Linking.getInitialURL().then((url) => {
      if (url) {
            console.log(url);
        }
    
    }).catch(err => console.error('An error occurred', err));

    // Requests permissions for external directory
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  
    if (permissions.granted) {
      // Gets SAF URI from response
      const uri = permissions.directoryUri;
  
      // Gets all files inside of selected directory
      const files = await StorageAccessFramework.readDirectoryAsync(uri);
      alert(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);
    }


    //const uri = await FS.readDirectoryAsync('content://com.android.providers.downloads.documents/tree/downloads')
    //const uri = await FS.readAsStringAsync('file:///private/var/mobile/Containers/Data/Application/', { encoding: FS.EncodingType.Base64 })
  }

  React.useEffect(() => {
    fileS()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

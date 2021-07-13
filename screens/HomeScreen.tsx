import React,{useEffect, useState} from 'react';
import {   StyleSheet } from 'react-native';
import { Text } from '../components/Themed';
import MapView,{Marker} from 'react-native-maps';
import * as DocumentPicker from 'expo-document-picker';
import * as fs from 'expo-file-system'
import XLSX from 'xlsx'
import {Box,NativeBaseProvider,Button,Icon} from 'native-base'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

type orden = {
  DESCRIPCION: string,
  LATITUD: number,
  LONGITUD: number,
  TITULO: string
}

type excelData = {
  DESCRIPCION: string,
  LATITUD: string,
  LONGITUD: string,
  TITULO: string
}

export default function TabOneScreen() {
  const [file, setfile] = useState({
    uri:'',
    name:'',
    directory:''
  })
  const [mapVisible,setMapVisible] = useState(false)
  const [markers,setMarkers] = useState<orden[]>([])

  const handleSelectFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({copyToCacheDirectory:true});
    console.log(res.type);
    console.log(res);
    //@ts-ignore
    setfile({uri:res.uri,name:res.name,directory:'DocumentPicker'})
  }

  const handleLoadMap = async ()=>{
    const tempName = file.uri.slice(file.uri.lastIndexOf('/'))
    //console.log('te: ',tempName)
    fs.readAsStringAsync(`${fs.cacheDirectory}/${file.directory}${tempName}`, {encoding: fs.EncodingType.Base64}).then(b64 => XLSX.read(b64, {type: "base64"})).then(wb => { 
      console.log('asd: ',XLSX.utils.sheet_to_json(wb.Sheets.Hoja1))


      structureMarkers(XLSX.utils.sheet_to_json(wb.Sheets.Hoja1))
    
    });
  }

  const structureMarkers = (sheet:Array<excelData>) =>{
    const auxMarkers:orden[] = []
    sheet.map(orden=>{
      auxMarkers.push({DESCRIPCION:orden.DESCRIPCION,LATITUD:parseFloat(orden.LATITUD),LONGITUD:parseFloat(orden.LONGITUD),TITULO:orden.TITULO})
    })

    console.log('markers: ',auxMarkers)
    setMarkers(auxMarkers)
    setMapVisible(true)
  }


  return (
    <NativeBaseProvider>
      <Box  flex={1} alignItems="center" justifyContent="center">
        <Box px={4} w="100%" alignItems="center" justifyContent="space-between" flexDirection="row">
          <Button onPress={handleSelectFile}   startIcon={<Icon as={MaterialCommunityIcons} name="microsoft-excel" size={7} />} > Subir Ordenes </Button>
          <Button onPress={handleLoadMap} disabled={file.uri != '' ? false : true} startIcon={<Icon as={AntDesign} name="reload1" size={7} />} > Cargar Mapa </Button>
        </Box>
        {mapVisible && markers ? (
          <MapView
          style={styles.map}
          initialRegion={{
            latitude: -34.8918538916433,
            longitude: -56.16171287449369,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {markers.map((marker,i) => (
            <Marker
              key={i}
              coordinate={{ latitude: marker.LATITUD, longitude: marker.LONGITUD }}
              title={marker.TITULO}
              description={marker.DESCRIPCION}
            />
          ))}
        </MapView>
        ) : null}
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    width: "100%",
    height: "80%",
  },
});

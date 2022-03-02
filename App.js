import Header from './Components/Header';
import Gameboard from './Components/Game';
import { View, Text } from 'react-native';
import React from 'react';



export default function App() {
  return (
    <View style={{fontSize: 20, backgroundColor: '#87cefa'}}>
      <Header/>
      <Gameboard/>
      <Text style={{marginBottom: 1, marginTop: 30, fontSize: 8, textAlign: 'right'}}>By Jérôme Chirol </Text>
      </View>
  );

}


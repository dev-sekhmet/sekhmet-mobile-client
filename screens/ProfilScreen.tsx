import {Dimensions, SafeAreaView, ScrollView, StyleSheet, TextInput} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import {Avatar} from "react-native-elements";
import {Button} from "react-native-paper";
import React from "react";
const width = Dimensions.get('screen').width;

export default function ProfilScreen() {
  // const navigation = useNavigation();

  // const saveData = async () => {
  //     navigation.
  // }

  return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ScrollView style={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View style={{paddingVertical: 10, alignItems: 'center'}}>
              <Avatar
                  size={80}
                  rounded
                  source={require("../assets/images/photoprofil.png")}
                  containerStyle={{
                    borderColor: 'grey',
                    borderStyle: 'solid',
                    borderWidth: 1,
                  }}
              />
              <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 4, fontSize: 15}}>Brenda Maboma</Text>
              <View style={{height: 1.0, marginTop: 1, width: width * 0.8, backgroundColor: 'grey'}}/>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
  )
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

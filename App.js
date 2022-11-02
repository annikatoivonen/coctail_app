import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { NativeBaseProvider, Box, HStack, Text, Button, Input, Icon, FavouriteIcon } from "native-base";
import { NavigationContainer } from'@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Coctails( {navigation }){

const [search, setSearch] = useState('');
const [repositories, setRepositories] = useState([]);
const [coctailName, setCoctailname] = useState([]);


const updateSearch = () => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+search)
    .then(response => response.json())
    .then(data => setRepositories(data.drinks))
    .catch(error => {
      Alert.alert('Error', error);
    });
}

  return (
    <NativeBaseProvider>
    <View style={styles.container}>
      
      <View style={{flex:0.5, justifyContent:'center'}}>
        <HStack w="350" bg="secondary.600" py="3" px="1" justifyContent="space-between" alignItems="center">
          <Text color="white" fontSize="25">Coctails</Text>
          <Button bg="secondary.600" onPress={() => navigation.navigate('Favourites', {coctailName})}><FavouriteIcon color="secondary.100" size="8"/></Button>
        </HStack>
      <Box w="80" rounded="lg" borderColor="secondary.200" borderWidth="1" padding="5" margin="2">
        <Input
        borderColor="secondary.200"
        placeholder='Type ingredient...'
        onChangeText={text => setSearch(text)}>
        </Input>
        <Button
        margin="2"
        size="sm"
        variant="subtle"
        colorScheme="secondary"
        onPress={updateSearch}>
          SEARCH
        </Button>
      </Box></View>
        <FlatList style={{flex:6}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
          <View>
            <Box w="350" borderBottomWidth="1" py="2" flexDirection="row" alignItems="center" justifyContent="space-between" margin="2" >
            <Image source={{url: item.strDrinkThumb+'/preview'}}
            style={styles.image}></Image>
            <Text fontSize="15" onPress={() => navigation.navigate("Recipe", {name: item.strDrink})}>{item.strDrink}</Text>
            <Button bg="white"><FavouriteIcon color="secondary.800"/></Button>
            </Box>
          </View>}
          data={repositories}
        />
      <StatusBar style="auto" />
    </View>
    </NativeBaseProvider>
  );
  }

  function Favourites({ route, navigation }){
    
  }

  function Recipe({ route, navigation }){

    const { name } = route.params;
    const [info, setInfo] = useState([]);

    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+JSON.stringify(name))
    .then(response => response.json())
    .then(data => setInfo(data.drinks))
    .catch(error => {
      Alert.alert('Error', error);
    });

    return(
      <View styles={styles.container}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
          <View>
            <Box w="350">
            <Text>{item.strDrink}</Text>
            </Box>
          </View>}
          data={info}
        />
      </View>
    );
  }

  export default function App() {
    return(
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Coctails" component={Coctails}/>
    <Stack.Screen name="Favourites" component={Favourites}/>
    <Stack.Screen name="Recipe" component={Recipe}/>
  </Stack.Navigator>
</NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
  input: {
    margin:12,
    padding:10,
    borderWidth:1,
    width:300,
  },
  image: {
    width:100,
    height:100,
    marginRight:20,
  }
});

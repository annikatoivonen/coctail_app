import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Image, Alert, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, VStack, IconButton, CloseIcon, Text, Button, Input, DeleteIcon, FavouriteIcon, Heading } from "native-base";
import { NavigationContainer } from'@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove, child } from'firebase/database';

const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyAgJ8FskzBjYcfeCAq3U222Bd2GwbQ4eN0",
  authDomain: "cocktail-de27e.firebaseapp.com",
  databaseURL: "https://cocktail-de27e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cocktail-de27e",
  storageBucket: "cocktail-de27e.appspot.com",
  messagingSenderId: "676849242590",
  appId: "1:676849242590:web:cc940fb468bc2710024d4f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



function Coctails( {navigation }){

const [search, setSearch] = useState('');
const [repositories, setRepositories] = useState([]);
const [items, setItems] = useState([]);

useEffect(() => {
  const itemsRef = ref(database, 'items/');
  onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    
    const stuff = data ? Object.keys(data).map(key => ({key, ...data[key]})) : [];
    setItems(stuff);
  })
}, []);

const saveItem = (item) => {
  push(ref(database, 'items/'),
{ 'cocktail': item.strDrink, 'image': item.strDrinkThumb });
return(
  Alert.alert(
    item.strDrink,
    "Saved to favourites!"
  )
)
}

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
          <Button bg="secondary.600" onPress={() => navigation.navigate('Favourites', {items, database})}><FavouriteIcon color="secondary.100" size="8"/>My Favourites</Button>
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
          keyExtractor={(item, index) => index}
          renderItem={({item}) =>
          <View>
            <Box w="350" borderBottomWidth="1" py="2" flexDirection="row" alignItems="center" justifyContent="space-between" margin="2">
            <Image source={{url: item.strDrinkThumb+'/preview'}}
            style={styles.image}></Image>
            <Text fontSize="12" onPress={() => navigation.navigate("Recipe", {name: item.strDrink})}>{item.strDrink}</Text>
            <Button bg="white" onPress={() => {saveItem(item)}}><FavouriteIcon color="secondary.800"/></Button>
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
    const { items, database }  = route.params;

    const success = (item) => {
         return(
         Alert.alert(
          item.cocktail,
          "Drink deleted!",
        )
      )
    }

    const deleteItem = (item) => {
      console.log(item);
      remove(ref(database, 'items/'+item.key));
      success(item);
     }

    return(
      <NativeBaseProvider>
        <View style={styles.container}>
        <View style={{justifyContent:'center'}}>
        <HStack w="350" bg="secondary.600" py="3" px="1" justifyContent="center" alignItems="center">
          <Text color="white" fontSize="25">Favourites</Text>
        </HStack>

         <FlatList
          keyExtractor={item => item.key}
          renderItem={({item}) =>
          <View>
            <Box w="350" borderBottomWidth="1" py="2" flexDirection="row" alignItems="center" justifyContent="space-between" margin="2">
            <Image source={{url: item.image+'/preview'}}
            style={styles.image}></Image>
            <Text fontSize="12"onPress={() => navigation.navigate("Recipe", {name: item.cocktail})}>{item.cocktail}</Text>
            <Button bg="white" onPress={() => {deleteItem(item)}}><DeleteIcon color="secondary.800"/></Button>
            </Box>
          </View>}
          data={items}
          />
          </View>
          </View>
      </NativeBaseProvider>
    );
  }

  function Recipe({ route, navigation }){

    const { name } = route.params;
    const [info, setInfo] = useState([]);

    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+name)
    .then(response => response.json())
    .then(data => setInfo(data.drinks))
    .catch(error => {
      Alert.alert('Error', error);
    });

    return(
      <NativeBaseProvider>
      <View styles={styles.container}>
      <Box bg="secondary.600" alignItems="center"><FlatList
            data={info}
            renderItem={({ item }) =>
            
            <Box w="80" bg="white" rounded="lg" borderColor="secondary.300" borderWidth="3" marginTop="5" alignItems="center">
            <Box alignItems="center" margin="5">
            <Heading size="lg">{item.strDrink}</Heading>
            </Box>
            <Image source={{url: item.strDrinkThumb+'/preview'}} style={styles.image2}></Image>
              <Text fontSize="12">{item.strCategory}</Text>
              <Text>{item.strAlcoholic}</Text>
            <Box alignItems="center" margin="3">
              <Heading size="sm">Glass:</Heading>
              <Text>{item.strGlass}</Text>
            </Box>  
            <Box alignItems="center" margin="3">
              <Heading size="sm">Instructions:</Heading>
              <Text>{item.strInstructions}</Text>
            </Box>
            <Box alignItems="center" margin="3">
              <Heading size="sm">Ingredients:</Heading>
              <Text>{item.strMeasure1}  {item.strIngredient1}</Text>
              <Text>{item.strMeasure2}  {item.strIngredient2}</Text>
              <Text>{item.strMeasure3}  {item.strIngredient3}</Text>
              <Text>{item.strMeasure4}  {item.strIngredient4}</Text>
              <Text>{item.strMeasure5}  {item.strIngredient5}</Text>
              <Text>{item.strMeasure6}  {item.strIngredient6}</Text>
              <Text>{item.strMeasure7}  {item.strIngredient7}</Text>
              <Text>{item.strMeasure8}  {item.strIngredient8}</Text>
              <Text>{item.strMeasure9}  {item.strIngredient9}</Text>
              <Text>{item.strMeasure10}  {item.strIngredient10}</Text>
              <Text>{item.strMeasure11}  {item.strIngredient11}</Text>
              <Text>{item.strMeasure12}  {item.strIngredient12}</Text>
              <Text>{item.strMeasure13}  {item.strIngredient13}</Text>
              <Text>{item.strMeasure14}  {item.strIngredient14}</Text>
              <Text>{item.strMeasure15}  {item.strIngredient15}</Text>
            </Box>
            </Box>
            }>
        </FlatList></Box>
      </View>
      </NativeBaseProvider>
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
  },
  image2: {
    width:150,
    height:150,
    marginBottom: 10,
  }
});

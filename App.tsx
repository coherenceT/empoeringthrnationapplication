import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp } from '@react-navigation/native';

const Stack = createStackNavigator();
const sampleDishes = [
  { name: 'Starlight Risotto', category: 'main', price: 100, description: 'A creamy risotto, infused with herbs and Parmesan cheese.' },
  { name: 'Crimson Ember Steak', category: 'main', price: 150, description: 'Juicy steak with a smoky flavor and red wine reduction.' },
  { name: 'Golden Bread Sticks', category: 'starter', price: 180, description: 'Warm, crispy breadsticks with garlic butter.' },
  { name: 'Twilight Tiramisu', category: 'dessert', price: 100, description: 'Classic dessert with coffee-soaked ladyfingers and mascarpone.' },
  { name: 'Emerald Soup', category: 'starter', price: 400, description: 'A creamy soup made from fresh green vegetables.' },
];

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Christoffel' }} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="CustomDish" component={CustomDishScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

type Props = {
  navigation: NavigationProp<any>;
};

const Splash: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 3000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B2B2B2' }}>
      <Image source={require('./assets/christofelopen.png')} />
    </View>
  );
};

const calculateCategoryAverages = (category: string) => {
  const dishes = sampleDishes.filter(dish => dish.category === category);
  const totalDishes = dishes.length;
  const totalPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);
  const averagePrice = totalDishes > 0 ? totalPrice / totalDishes : 0;
  return { totalDishes, averagePrice: averagePrice.toFixed(2) };
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const { totalDishes: totalMainDishes, averagePrice: avgMainPrice } = calculateCategoryAverages('main');

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#442A00', padding: 20 }}>
      <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>Christoffel</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Filter')} style={{ position: 'absolute', right: 10, top: 10 }}>
        <Text style={{ color: 'grey', fontSize: 16 }}>Filter</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Image
          source={require('./assets/starlight.png')}
          style={{ width: 348, height: 123, borderRadius: 15 }}
        />
        <Text style={{ fontSize: 28, color: 'white', marginTop: 10 }}>Starlight Risotto</Text>
        <Text style={{ color: 'white', fontSize: 16, marginTop: 10 }}>Price: R100</Text>
        <View style={{ marginTop: 10 }}>
          <Button title="Order" color="grey" onPress={() => navigation.navigate('Payment')} />
        </View>

        <Image
          source={require('./assets/crimsonEmberSteak.png')}
          style={{ width: 348, height: 123, marginTop: 30, borderRadius: 15 }}
        />
        <Text style={{ fontSize: 28, color: 'white', marginTop: 10 }}>Crimson Ember Steak</Text>
        <Text style={{ color: 'white', fontSize: 16, marginTop: 10 }}>Price: R150</Text>
        <View style={{ marginTop: 10 }}>
          <Button title="Order" color="grey" onPress={() => navigation.navigate('Payment')} />
        </View>
      </View>

      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Button title="Custom Dish" color="grey" onPress={() => navigation.navigate('CustomDish')} />
      </View>

      <Text style={{ color: 'white', marginTop: 20, textAlign: 'center' }}>Main Dishes: {totalMainDishes}</Text>
      <Text style={{ color: 'white', textAlign: 'center' }}>Average Price: R{avgMainPrice}</Text>
    </ScrollView>
  );
};
const FilterScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#442A00', padding: 20 }}>
      <Text style={{ fontSize: 42, color: 'white', textAlign: 'center' }}>🍽️ Christoffel 🍷</Text>
      <Text style={{ color: 'white', fontSize: 24, marginTop: 20, textAlign: 'center' }}>Choose your meal and enjoy! 😊</Text>
      <Text style={{ color: 'white', fontSize: 28, marginTop: 40 }}>🥗 Starters - Fresh & Light</Text>
      <Text style={{ color: 'white', fontSize: 28, marginTop: 20 }}>🍝 Main - Delicious & Hearty</Text>
      <Text style={{ color: 'white', fontSize: 28, marginTop: 20 }}>🍰 Dessert - Sweet Treats</Text>
      <Text style={{ color: 'white', fontSize: 28, marginTop: 20 }}>🍹 Drinks - Refreshing Choices</Text>
      <Text style={{ color: 'white', fontSize: 28, marginTop: 20 }}>🍳 Breakfast - Good Morning!</Text>
    </View>
  );
};
const CustomDishScreen = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [dishSelectOpen, setDishSelectOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cookingTime, setCookingTime] = useState('');
  const [chefNotes, setChefNotes] = useState('');

  const sampleDishes = [
    { name: 'Starlight Risotto', category: 'main', price: 100, description: 'A creamy risotto, infused with herbs and Parmesan cheese.' },
    { name: 'Crimson Ember Steak', category: 'main', price: 150, description: 'Juicy steak with a smoky flavor and red wine reduction.' },
    { name: 'Golden Bread Sticks', category: 'starter', price: 180, description: 'Warm, crispy breadsticks with garlic butter.' },
    { name: 'Twilight Tiramisu', category: 'dessert', price: 100, description: 'Classic dessert with coffee-soaked ladyfingers and mascarpone.' },
    { name: 'Emerald Soup', category: 'starter', price: 400, description: 'A creamy soup made from fresh green vegetables.' },
  ];
  const handlePhotoUpload = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        ToastAndroid.show('Upload cancelled', ToastAndroid.SHORT);
      } else if (response.errorMessage) {
        ToastAndroid.show('Error uploading', ToastAndroid.SHORT);
      } else if (response.assets && response.assets.length > 0) {
        setUploadedImage(response.assets[0].uri);
        ToastAndroid.show('Photo uploaded', ToastAndroid.SHORT);
      }
    });
  };
  const handleDishSelect = (value) => {
    const selected = sampleDishes.find(dish => dish.name === value);
    setSelectedDish(value);
    setDescription(selected ? selected.description : '');
    setPrice(selected ? `Price: R${selected.price}` : '');
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#442A00', padding: 20 }}>
      <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>Christoffel</Text>
      <Text style={{ color: 'white', fontSize: 18, marginTop: 20, textAlign: 'center' }}>Create and Customize Your Dish</Text>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        items={[
          { label: '🥗 Starter', value: 'starter' },
          { label: '🍝 Main', value: 'main' },
          { label: '🍰 Dessert', value: 'dessert' },
        ]}
        placeholder="Select Category"
        containerStyle={{ height: 40, marginTop: 20 }}
        style={{ backgroundColor: '#4d4d4d' }}
        dropDownStyle={{ backgroundColor: '#2e2e2e' }}
        value={category}
        setValue={setCategory}
      />

      <DropDownPicker
        open={dishSelectOpen}
        setOpen={setDishSelectOpen}
        items={sampleDishes.filter((dish) => dish.category === category).map(dish => ({ label: dish.name, value: dish.name }))}
        placeholder="Select Available Dish"
        containerStyle={{ height: 40, marginTop: 20 }}
        style={{ backgroundColor: '#4d4d4d' }}
        dropDownStyle={{ backgroundColor: '#2e2e2e' }}
        value={selectedDish}
        setValue={handleDishSelect}
      />

      {selectedDish && (
        <View style={{ backgroundColor: '#333333', padding: 15, marginTop: 20, borderRadius: 10 }}>
          <Text style={{ color: '#FFD700', fontSize: 24, fontWeight: 'bold' }}>{selectedDish}</Text>
          <Text style={{ color: '#FFD700', marginTop: 5 }}>{price}</Text>
          <Text style={{ color: 'white', marginTop: 10 }}>{description}</Text>
        </View>
      )}

      {uploadedImage && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image source={{ uri: uploadedImage }} style={{ width: 300, height: 200, borderRadius: 15 }} />
        </View>
      )}

      <TouchableOpacity onPress={handlePhotoUpload} style={{ marginTop: 20, backgroundColor: '#B2B2B2', padding: 10, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Upload Dish Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={{ marginTop: 20, backgroundColor: 'white', padding: 10, height: 50, textAlignVertical: 'top', borderRadius: 10 }}
        placeholder="Cooking Time (e.g., 30 mins)"
        value={cookingTime}
        onChangeText={setCookingTime}
      />
      <TextInput
        style={{ marginTop: 20, backgroundColor: 'white', padding: 10, height: 100, textAlignVertical: 'top', borderRadius: 10 }}
        placeholder="Chef's Notes..."
        value={chefNotes}
        onChangeText={setChefNotes}
        multiline
      />
      <TextInput
        style={{ marginTop: 20, backgroundColor: 'white', padding: 10, height: 100, textAlignVertical: 'top', borderRadius: 10 }}
        placeholder="Add or edit dish description..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity onPress={() => ToastAndroid.show('Dish Added Successfully!', ToastAndroid.SHORT)} style={{ marginTop: 20, backgroundColor: '#FFD700', padding: 15, borderRadius: 15 }}>
        <Text style={{ color: '#442A00', textAlign: 'center', fontWeight: 'bold' }}>Submit Dish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#442A00', padding: 20 }}>
      <Text style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>Payment</Text>
      
      <TextInput
        placeholder="Card Number"
        placeholderTextColor="white"
        onChangeText={setCardNumber}
        keyboardType="numeric"
        style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginTop: 20, color: 'white' }}
      />
      
      <TextInput
        placeholder="Expiry Date (MM/YY)"
        placeholderTextColor="white"
        onChangeText={setExpiryDate}
        style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginTop: 20, color: 'white' }}
      />
      
      <TextInput
        placeholder="CVV"
        placeholderTextColor="white"
        onChangeText={setCvv}
        keyboardType="numeric"
        style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginTop: 20, color: 'white' }}
      />
      <TouchableOpacity 
        onPress={() => ToastAndroid.show('Payment Processed!', ToastAndroid.SHORT)} 
        style={{ marginTop: 20, backgroundColor: '#B2B2B2', padding: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Submit Payment</Text>
      </TouchableOpacity>
    </View>
  );
};
export default App;
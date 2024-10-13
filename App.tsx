import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageBackground, View, Text, Button, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const coursePrices: Record<string, number> = {
  "First Aid": 1500,
  "Sewing": 1500,
  "Life Skills": 1500,
  "Landscaping": 1500,
  "Child Minding": 750,
  "Cooking": 750,
  "Garden Maintaining": 750,
};

const courseImages: Record<string, any> = {
  "First Aid": require('./assets/firstaid.png'),
  "Sewing": require('./assets/sewing.png'),
  "Life Skills": require('./assets/lifeskills.png'),
  "Landscaping": require('./assets/landscaping.png'),
  "Child Minding": require('./assets/childminding.png'),
  "Cooking": require('./assets/cooking.png'),
  "Garden Maintaining": require('./assets/gardening.png'),
};

// Splash Screen
const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return <ImageBackground source={require('./assets/splashscreen.png')} style={styles.splashScreen} />;
};

// Login Screen

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      // Simple username/password validation (you can replace this logic with your own authentication)
      if (user && user.username === values.username && user.password === values.password) {
        Alert.alert("Success", "Logged in successfully!");
        navigation.navigate('Home'); // Navigate to Home screen
      } else {
        Alert.alert("Error", "Invalid username or password.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleLogin}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Please enter your username or email.'),
        password: Yup.string().required('Please enter your password.'),
      })}
    >
      {({ handleChange, handleSubmit, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          {/* Username Input */}
          <TextInput
            placeholder="Username or Email"
            onChangeText={handleChange('username')}
            style={styles.input}
          />
          {errors.username && touched.username && <Text style={styles.error}>{errors.username}</Text>}

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            secureTextEntry
            style={styles.input}
          />
          {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

          {/* Login Button */}
          <Button onPress={handleSubmit} title={isLoading ? "Logging in..." : "Login"} disabled={isLoading} />

          {/* Navigate to Register */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};
const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setProfileImage(pickerResult.uri);
    }
  };

  const handleRegister = async (values: { username: string; email: string; password: string }) => {
    await AsyncStorage.setItem('user', JSON.stringify(values));
    Alert.alert("Success", "Account created successfully!");
    navigation.navigate('Login');
  };

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={handleRegister}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Please enter username'),
        email: Yup.string().email('Invalid email').required('Please enter email'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Please enter password'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Please confirm your password'),
      })}
    >
      {({ handleChange, handleSubmit, errors, touched }) => (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create an Account</Text>

          {/* Profile Picture Picker */}
          <TouchableOpacity onPress={handleImagePick}>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profileImagePlaceholder}>Pick Profile Image</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Username Input */}
          <TextInput
            placeholder="Username"
            onChangeText={handleChange('username')}
            style={styles.input}
          />
          {errors.username && touched.username && <Text style={styles.error}>{errors.username}</Text>}

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            style={styles.input}
          />
          {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            secureTextEntry
            style={styles.input}
          />
          {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <TextInput
            placeholder="Confirm Password"
            onChangeText={handleChange('confirmPassword')}
            secureTextEntry
            style={styles.input}
          />
          {errors.confirmPassword && touched.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

          {/* Register Button */}
          <Button onPress={handleSubmit} title="Register" />

          {/* Navigate to Login */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

// Home Screen
const HomeScreen = ({ navigation }: { navigation: any }) => (
  <ImageBackground source={require('./assets/background.png')} style={styles.background}>
    <Text style={styles.title}>Select a Course</Text>
    <Button title="Six-Month Courses" onPress={() => navigation.navigate('SixMonthCourses')} />
    <Button title="Six-Week Courses" onPress={() => navigation.navigate('SixWeekCourses')} />
    <Button title="About Us" onPress={() => navigation.navigate('AboutUs')} />
    <Button title="Calculate Fees" onPress={() => navigation.navigate('CalculateFees')} />
  </ImageBackground>
  
);

// Six-Month Courses Screen
const SixMonthCoursesScreen = ({ navigation }: { navigation: any }) => (
  <View style={styles.courseContainer}>
    <Text style={styles.courseTitle}>Six Month Courses</Text>
    {["First Aid", "Sewing", "Life Skills", "Landscaping"].map((course) => (
      <CourseCard key={course} course={course} price={coursePrices[course]} image={courseImages[course]} navigation={navigation} />
    ))}
  </View>
);

// Six-Week Courses Screen
const SixWeekCoursesScreen = ({ navigation }: { navigation: any }) => (
  <View style={styles.courseContainer}>
    <Text style={styles.courseTitle}>Six Week Courses</Text>
    {["Child Minding", "Cooking", "Garden Maintaining"].map((course) => (
      <CourseCard key={course} course={course} price={coursePrices[course]} image={courseImages[course]} navigation={navigation} />
    ))}
  </View>
);

// Course Card Component
const CourseCard = ({ course, price, image, navigation }: { course: string; price: number; image: any; navigation: any }) => (
  <View style={styles.card}>
    <Image source={image} style={styles.courseImage} />
    <Text>{course} - {price} Rand</Text>
    <Button title="Interested?" onPress={() => navigation.navigate('CourseDetails', { course })} />
  </View>
);

// Course Details Screen
const CourseDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { course } = route.params;

  return (
    <View style={styles.courseDetailContainer}>
      <Image source={courseImages[course]} style={styles.detailImage} />
      <Text style={styles.courseDetailTitle}>{course}</Text>
      <Text style={styles.courseDetailText}>
        Course Content: Basic details about {course}
      </Text>
      <Button title="Enroll" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

// Calculate Fees Screen
const CalculateFeesScreen = ({ navigation }) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    const getSelectedCourses = async () => {
      const courses = await AsyncStorage.getItem('selectedCourses');
      const parsedCourses = courses ? JSON.parse(courses) : [];
      setSelectedCourses(parsedCourses);
      const fees = parsedCourses.reduce((sum, course) => sum + coursePrices[course], 0);
      setTotalFees(fees);
    };
    getSelectedCourses();
  }, []);

  return (
    <View style={styles.feesContainer}>
      <Text>Total Fees: {totalFees} Rand</Text>
      <Button title="Edit Courses" onPress={() => navigation.navigate('Home')} />
      <Button
        title="Proceed to Payment"
        onPress={() => navigation.navigate('Purchase', { totalFees })}
      />
    </View>
  );
};


// Purchase Screen
const PurchaseScreen = ({ route }) => {
  const { totalFees } = route.params; // Destructure the totalFees from route.params
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvc: '' });

  const handlePayment = () => {
    // Handle payment logic here
    Alert.alert('Payment Successful', `You have successfully paid with ${paymentMethod}`);
  };

  return (
    <View style={styles.paymentContainer}>
      <Text>Total Fees: {totalFees} Rand</Text> {/* Display total fees */}
      <Text>Select Payment Method:</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity onPress={() => setPaymentMethod('Card')}>
          <Text style={styles.paymentText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPaymentMethod('E-Wallet')}>
          <Text style={styles.paymentText}>E-Wallet</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'Card' && (
        <View>
          <TextInput placeholder="Card Number" onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })} />
          <TextInput placeholder="Expiry (MM/YY)" onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })} />
          <TextInput placeholder="CVC" onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })} />
        </View>
      )}

      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};


// About Us Screen
const AboutUsScreen = () => (
  <View style={styles.aboutContainer}>
    <Text style={styles.aboutText}>About Us</Text>
    <Text style={styles.descriptionText}>
      Precious Radebe, a passionate advocate for social empowerment, founded Empowering the Nation in 2018 to uplift domestic workers and gardeners in South Africa.
    </Text>
    <Text style={styles.missionText}>Our Mission</Text>
    <Text style={styles.descriptionText}>
      We provide essential skills and knowledge to help improve the lives of domestic workers and gardeners. Our programs focus on practical training, skill-building, and personal growth to create better job opportunities and financial stability.
    </Text>
    <Text style={styles.whyText}>Why We Were Created</Text>
    <Text style={styles.descriptionText}>
      Understanding the struggles faced by many in these roles, Precious saw the need for upskilling programs that enhance job performance, foster confidence, and open new career paths.
    </Text>
    <Text style={styles.conclusionText}>
      Through this initiative, we are dedicated to empowering individuals to reach their full potential. Thank you for learning about our mission.
    </Text>
    <Image
      source={require('./assets/preciousradebe.png')} // Adjust the path to the image
      style={styles.image}
    />
  </View>
);


const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SixMonthCourses" component={SixMonthCoursesScreen} />
      <Stack.Screen name="SixWeekCourses" component={SixWeekCoursesScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="CalculateFees" component={CalculateFeesScreen} />
      <Stack.Screen name="Purchase" component={PurchaseScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  splashScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light background color for splash screen
  },
  formContainer: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ffffff', // White background for form
    borderRadius: 10,
    shadowColor: '#000', // Adding shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 50,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc', // Lighter border color
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5, // Rounded corners for inputs
  },
  error: {
    color: 'red',
  },
  loginText: {
    marginTop: 15,
    color: '#007BFF', // Bootstrap primary blue
    textAlign: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9', // Light grey background for course container
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Light border color for cards
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#fff', // White background for cards
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 5, // Rounded corners for course images
  },
  courseDetailContainer: {
    padding: 20,
    alignItems: 'center',
  },
  detailImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 5, // Rounded corners for detail images
  },
  courseDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseDetailText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  feesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  paymentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Light border color for payment options
    borderRadius: 5,
    backgroundColor: '#e9ecef', // Light background for payment options
  },
  aboutContainer: {
    padding: 20,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50', // Button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Full-width buttons
    marginBottom: 10, // Spacing between buttons
  },
  buttonText: {
    color: '#fff', // White text for buttons
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
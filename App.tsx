import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageBackground, View, Text, Button, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

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

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home'); // Navigate to the Home screen
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground
        source={require('./assets/splashscreen.png')}
        style={{
          width: 393, // Set the width
          height: 500, // Set the height
        }}
      />
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    selectedCourses: [], // Initialize as an empty array
    totalFees: 0,
    discount: 0,
    finalPrice: 0,
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      console.log('Retrieved User:', user); // Log the retrieved user data

      if (user && user.username === values.username && user.password === values.password) {
        // Set user info for modal display
        setUserInfo({
          selectedCourses: user.selectedCourses || [], // Ensure it's an array
          totalFees: user.totalFees || 0,
          discount: user.discount || 0,
          finalPrice: user.finalPrice || 0,
        });
        setModalVisible(true); // Show the modal
      } else {
        Alert.alert("Error", "Invalid username or password.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Home'); // Navigate to Home after closing modal
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
        <ScrollView contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f7f7f7',
          padding: 20,
        }}>
          {/* Logo */}
          <View style={{ marginBottom: 30, alignItems: 'center' }}>
            <Image source={require('./assets/logo.png')} style={{ width: 100, height: 100, borderRadius: 50 }} />
          </View>

          {/* Login Inputs */}
          <View style={{ width: '100%', marginBottom: 20 }}>
            <TextInput
              placeholder="Username or Email"
              onChangeText={handleChange('username')}
              style={{
                height: 50,
                borderColor: '#ddd',
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 15,
                borderRadius: 8,
                backgroundColor: '#fff',
              }}
            />
            {errors.username && touched.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

            <TextInput
              placeholder="Password"
              onChangeText={handleChange('password')}
              secureTextEntry
              style={{
                height: 50,
                borderColor: '#ddd',
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 15,
                borderRadius: 8,
                backgroundColor: '#fff',
              }}
            />
            {errors.password && touched.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              width: '100%',
              paddingVertical: 15,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
              backgroundColor: isLoading ? '#777' : '#000',
            }}
            disabled={isLoading}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Navigate to Register */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ marginTop: 10, color: '#007BFF', textAlign: 'center' }}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>

          {/* Modal for showing details */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Welcome!</Text>
              <Text style={{ fontSize: 18 }}>
                Selected Courses: {Array.isArray(userInfo.selectedCourses) && userInfo.selectedCourses.length > 0 
                  ? userInfo.selectedCourses.join(', ') 
                  : 'None'}
              </Text>
              <Text style={{ fontSize: 18 }}>Total Fees: {userInfo.totalFees} Rand</Text>
              <Text style={{ fontSize: 18 }}>Discount: {userInfo.discount}%</Text>
              <Text style={{ fontSize: 18 }}>Final Price: {userInfo.finalPrice} Rand</Text>
              
              <TouchableOpacity onPress={handleCloseModal} style={{
                marginTop: 20,
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 8,
                backgroundColor: '#000',
              }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
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
    if (!pickerResult.canceled) {
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
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#f7f7f7',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>Create an Account</Text>

          {/* Profile Picture Picker */}
          <TouchableOpacity onPress={handleImagePick}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 1,
              borderColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }} />
              ) : (
                <Text style={{ color: '#888' }}>Pick Profile Image</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Username Input */}
          <TextInput
            placeholder="Username"
            onChangeText={handleChange('username')}
            style={{
              height: 50,
              width: '100%',
              borderColor: '#ddd',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
          />
          {errors.username && touched.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            style={{
              height: 50,
              width: '100%',
              borderColor: '#ddd',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
          />
          {errors.email && touched.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            secureTextEntry
            style={{
              height: 50,
              width: '100%',
              borderColor: '#ddd',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
          />
          {errors.password && touched.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <TextInput
            placeholder="Confirm Password"
            onChangeText={handleChange('confirmPassword')}
            secureTextEntry
            style={{
              height: 50,
              width: '100%',
              borderColor: '#ddd',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
          />
          {errors.confirmPassword && touched.confirmPassword && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.confirmPassword}</Text>}

          {/* Register Button */}
          <Button
            onPress={handleSubmit}
            title="Register"
            color="#000"
          />

          {/* Navigate to Login */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ marginTop: 10, color: '#007BFF', textAlign: 'center' }}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => (
  <ImageBackground 
    source={require('./assets/background.png')} 
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
  >

    {/* Create Account Icon */}
    <View style={{ position: 'absolute', top: 40, right: 20 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Image 
          source={require('./assets/profile.png')} 
          style={{ width: 40, height: 40, borderRadius: 20 }} 
        />
      </TouchableOpacity>
    </View>

    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 30 }}>
      Select a Course
    </Text>

    <TouchableOpacity 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
      }} 
      onPress={() => navigation.navigate('SixMonthCourses')}
    >
      <Image 
        source={require('./assets/sixMonthCourses.jpg')} 
        style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }} 
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
        Six-Month Courses
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
      }} 
      onPress={() => navigation.navigate('SixWeekCourses')}
    >
      <Image 
        source={require('./assets/sixWeekCourses.jpg')} 
        style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }} 
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
        Six-Week Courses
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={() => navigation.navigate('AboutUs')}
      style={{
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>About Us</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={() => navigation.navigate('ContactUs')}
      style={{
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Contact Us</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={() => navigation.navigate('CalculateFees')}
      style={{
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Calculate Fees</Text>
    </TouchableOpacity>
  </ImageBackground>
);

const SixMonthCoursesScreen = ({ navigation }: { navigation: any }) => (
  <View style={{ flex: 1, backgroundColor: '#f7f7f7', padding: 20 }}>
    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Six-Month Courses</Text>
    {["First Aid", "Sewing", "Life Skills", "Landscaping"].map((course) => (
      <CourseCard 
        key={course} 
        course={course} 
        price={coursePrices[course]} 
        image={courseImages[course]} 
        navigation={navigation} 
      />
    ))}
  </View>
);

const SixWeekCoursesScreen = ({ navigation }: { navigation: any }) => (
  <View style={{ flex: 1, backgroundColor: '#f7f7f7', padding: 20 }}>
    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Six-Week Courses</Text>
    {["Child Minding", "Cooking", "Garden Maintaining"].map((course) => (
      <CourseCard 
        key={course} 
        course={course} 
        price={coursePrices[course]} 
        image={courseImages[course]} 
        navigation={navigation} 
      />
    ))}
  </View>
);

const CourseCard = ({ course, price, image, navigation }: { course: string; price: number; image: any; navigation: any }) => (
  <TouchableOpacity 
    onPress={() => navigation.navigate('CourseDetails', { course })} 
    style={{
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <Image 
      source={image} 
      style={{
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
        resizeMode: 'cover',
      }} 
    />
    
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{course}</Text>
      <Text style={{ fontSize: 16, color: '#888' }}>{price} Rand</Text>
    </View>
    
    <TouchableOpacity 
      onPress={() => navigation.navigate('CourseDetails', { course })} 
      style={{
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Details</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const CourseDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { course } = route.params;
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      const storedCourses = await AsyncStorage.getItem('selectedCourses');
      const enrolledCourses = storedCourses ? JSON.parse(storedCourses) : [];
      setIsEnrolled(enrolledCourses.includes(course));
    };
    checkEnrollment();
  }, [course]);

  const handleEnroll = async () => {
    const storedCourses = await AsyncStorage.getItem('selectedCourses');
    let enrolledCourses = storedCourses ? JSON.parse(storedCourses) : [];

    if (isEnrolled) {
      enrolledCourses = enrolledCourses.filter((c: string) => c !== course);
    } else {
      enrolledCourses.push(course);
    }

    await AsyncStorage.setItem('selectedCourses', JSON.stringify(enrolledCourses));
    setIsEnrolled(!isEnrolled);
  };

  const courseDetails = {
    "First Aid": {
      purpose: "To provide first aid awareness and basic life support.",
      content: [
        "Wounds and bleeding",
        "Burns and fractures",
        "Emergency scene management",
        "Cardio-Pulmonary Resuscitation (CPR)",
        "Respiratory distress (e.g., choking, blocked airway)"
      ],
    },
    "Sewing": {
      purpose: "To provide alterations and new garment tailoring services.",
      content: [
        "Types of stitches",
        "Threading a sewing machine",
        "Sewing buttons, zips, hems, and seams",
        "Alterations",
        "Designing and sewing new garments"
      ],
    },
    "Life Skills": {
      purpose: "To provide skills to navigate basic life necessities.",
      content: [
        "Opening a bank account",
        "Basic labor law (know your rights)",
        "Basic reading and writing literacy",
        "Basic numeric literacy"
      ],
    },
    "Landscaping": {
      purpose: "To provide knowledge about garden landscaping.",
      content: [
        "Watering, pruning, and planting",
        "Planting techniques",
        "Garden maintenance"
      ],
    },
    "Child Minding": {
      purpose: "To provide basic child and baby care.",
      content: [
        "Birth to six-month baby needs",
        "Seven-month to one-year needs",
        "Toddler needs",
        "Educational toys"
      ],
    },
    "Cooking": {
      purpose: "To teach the basics of cooking.",
      content: [
        "Meal planning",
        "Healthy cooking methods",
        "Baking techniques",
        "Safety in the kitchen"
      ],
    },
    "Garden Maintaining": {
      purpose: "To provide basic knowledge of watering, pruning, and planting.",
      content: [
        "Water restrictions",
        "Pruning techniques",
        "Propagation of plants"
      ],
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7', padding: 20, alignItems: 'center' }}>
      <Image source={courseImages[course]} style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 20, resizeMode: 'cover' }} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>{course}</Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
        Purpose: {courseDetails[course].purpose}
        {"\n\n"}
        Course Content: {courseDetails[course].content.join(', ')}
      </Text>
      <TouchableOpacity 
        onPress={handleEnroll}
        style={{
          backgroundColor: '#000',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{isEnrolled ? "Unenroll" : "Enroll"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const CalculateFeesScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [totalFees, setTotalFees] = useState(0);
  const [discountedFees, setDiscountedFees] = useState(0);
  const isFocused = useIsFocused(); // To refresh data on navigation

  // Function to calculate the total fees and apply discount
  const calculateTotalFees = (courses: string[]) => {
    const fees = courses.reduce((sum, course) => sum + coursePrices[course], 0);
    let discount = 0;

    // Discount logic based on the number of courses
    if (courses.length === 2) {
      discount = 0.05;
    } else if (courses.length === 3) {
      discount = 0.10;
    } else if (courses.length > 3) {
      discount = 0.15;
    }

    const discountedAmount = fees - fees * discount;
    setTotalFees(fees);
    setDiscountedFees(discountedAmount);
  };

  useEffect(() => {
    const getSelectedCourses = async () => {
      const courses = await AsyncStorage.getItem('selectedCourses');
      const parsedCourses = courses ? JSON.parse(courses) : [];
      setSelectedCourses(parsedCourses);
      calculateTotalFees(parsedCourses);
    };

    if (isFocused) {
      getSelectedCourses();
    }
  }, [isFocused]);

  const removeCourse = async (courseToRemove: string) => {
    const updatedCourses = selectedCourses.filter((course) => course !== courseToRemove);
    setSelectedCourses(updatedCourses);
    await AsyncStorage.setItem('selectedCourses', JSON.stringify(updatedCourses));
    calculateTotalFees(updatedCourses);
  };

  const handleProceedToEnroll = () => {
    if (selectedCourses.length === 0) {
      Alert.alert('No Courses Selected', 'Please select at least one course before enrolling.');
      return;
    }
  
    navigation.navigate('PurchaseScreen', {
      selectedCourses,
      totalFees: discountedFees.toFixed(2),
    });
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4f7', padding: 20 }}>
      {/* Title */}
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' }}>
        Your Course Selection
      </Text>

      {/* Placeholder or Selected Courses */}
      {selectedCourses.length === 0 ? (
        <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#999', textAlign: 'center', marginBottom: 20 }}>
          No courses selected yet.
        </Text>
      ) : (
        selectedCourses.map((course) => (
          <View
            key={course}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 15,
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, color: '#333' }}>{course} - {coursePrices[course]} Rand</Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#ff4d4d', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 }}
              onPress={() => removeCourse(course)}
            >
              <Text style={{ color: '#fff', fontSize: 14 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Total Fees */}
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>Total Fees (before discount): {totalFees} Rand</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#28a745', marginBottom: 20 }}>Total Fees (after discount): {discountedFees.toFixed(2)} Rand</Text>
      </View>

      {/* Enroll Button */}
      <TouchableOpacity
        style={{
          backgroundColor: selectedCourses.length === 0 ? '#aaa' : '#0099FF',
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5,
        }}
        onPress={handleProceedToEnroll}
        disabled={selectedCourses.length === 0}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          {selectedCourses.length === 0 ? 'Select a Course' : 'Proceed to Enroll'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const PurchaseScreen = ({ route, navigation }) => {
  const { selectedCourses, totalFees } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvc: '' });
  const [eWalletDetails, setEWalletDetails] = useState({ walletID: '' });

  const handlePayment = () => {
    if (paymentMethod === 'Card') {
      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc) {
        Alert.alert('Error', 'Please enter complete card details.');
        return;
      }
    } else if (paymentMethod === 'E-Wallet') {
      if (!eWalletDetails.walletID) {
        Alert.alert('Error', 'Please enter your E-Wallet ID.');
        return;
      }
    }
    
    Alert.alert(
      'Payment Successful',
      `You have successfully paid for ${selectedCourses.join(', ')} with ${paymentMethod}. Total: ${totalFees} Rand`
    );
    navigation.navigate('Home');
  };

  return (
    <View style={{
      flex: 1,
      padding: 20,
      backgroundColor: '#f9f9f9',
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
      }}>Purchase Summary</Text>
      
      <Text style={{
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
      }}>Total Fees: {totalFees} Rand</Text>
      
      <Text style={{
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
      }}>Selected Courses: {selectedCourses.join(', ')}</Text>

      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 15,
      }}>Select Payment Method:</Text>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <TouchableOpacity
          onPress={() => setPaymentMethod('Card')}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: paymentMethod === 'Card' ? '#007bff' : '#aaa',
            backgroundColor: paymentMethod === 'Card' ? '#e6f0ff' : 'transparent',
            borderRadius: 5,
            width: '48%',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#333' }}>Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setPaymentMethod('E-Wallet')}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: paymentMethod === 'E-Wallet' ? '#007bff' : '#aaa',
            backgroundColor: paymentMethod === 'E-Wallet' ? '#e6f0ff' : 'transparent',
            borderRadius: 5,
            width: '48%',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#333' }}>E-Wallet</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'Card' && (
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder="Card Number"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
            value={cardDetails.cardNumber}
            style={{
              height: 50,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          />
          <TextInput
            placeholder="Expiry (MM/YY)"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
            value={cardDetails.expiry}
            style={{
              height: 50,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          />
          <TextInput
            placeholder="CVC"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
            value={cardDetails.cvc}
            style={{
              height: 50,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          />
        </View>
      )}

      {paymentMethod === 'E-Wallet' && (
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder="E-Wallet ID"
            onChangeText={(text) => setEWalletDetails({ ...eWalletDetails, walletID: text })}
            value={eWalletDetails.walletID}
            style={{
              height: 50,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          />
        </View>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          paddingVertical: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={handlePayment}
      >
        <Text style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
        }}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const AboutUsScreen = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    }}>
      About Us
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    }}>
      Precious Radebe, a passionate advocate for social empowerment, founded Empowering the Nation in 2018 to uplift domestic workers and gardeners in South Africa.
    </Text>
    <Text style={{
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Our Mission
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    }}>
      We provide essential skills and knowledge to help improve the lives of domestic workers and gardeners. Our programs focus on practical training, skill-building, and personal growth to create better job opportunities and financial stability.
    </Text>
    <Text style={{
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Why We Were Created
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    }}>
      Understanding the struggles faced by many in these roles, Precious saw the need for upskilling programs that enhance job performance, foster confidence, and open new career paths.
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
    }}>
      Through this initiative, we are dedicated to empowering individuals to reach their full potential. Thank you for learning about our mission.
    </Text>
    <Image
      source={require('./assets/preciousradebe.png')} // Adjust the path to the image
      style={{
        width: 245,
        height: 223,
        borderRadius: 15, // Rounded edges
        resizeMode: 'cover',
      }}
    />
  </View>
);

const ContactUsScreen = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    }}>
      Contact Us
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      Phone Number:
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#333',
      marginBottom: 15,
    }}>
      021 713 4983
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      Email Address:
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#333',
      marginBottom: 15,
    }}>
      contact@etn.co.za
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Kensington Office
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      marginBottom: 15,
    }}>
      63 Roberts Avenue, Kensington, Johannesburg, 2101
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Parktown Office
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      marginBottom: 15,
    }}>
      6 Victoria Avenue, Parktown, Johannesburg, 2193
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Mayfair Office
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      marginBottom: 15,
    }}>
      102 Central Road, Mayfair, Johannesburg, 2108
    </Text>
    <Image
      source={require('./assets/location.png')}
      style={{
        width: 245,
        height: 223,
        borderRadius: 15,
        resizeMode: 'cover',
        marginTop: 20,
      }}
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
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="PurchaseScreen" component={PurchaseScreen} />
    </Stack.Navigator>

    {/* Toast Component */}
    <Toast ref={(ref) => Toast.setRef(ref)} />
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
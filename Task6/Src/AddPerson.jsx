import React, { useState } from 'react';

import {

  View,

  Text,

  TextInput,

  TouchableOpacity,

  StyleSheet,

  Image,

  SafeAreaView,

  StatusBar,

  Dimensions,

  ScrollView,

} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



// Get screen dimensions for responsive layout

const { width, height } = Dimensions.get('window');



const AddPersonScreen = () => {

  const [name, setName] = useState('');

  const [age, setAge] = useState('');

  const [gender, setGender] = useState('');

  const [language, setLanguage] = useState('');



  return (

    <SafeAreaView style={styles.container}>

      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />



      {/* --- BACKGROUND LAYERS --- */}



      {/* Header Gradient */}

      <View style={styles.headerContainer}>

        <Image

          source={require('../assets/Header.png')}

          style={styles.headerGradientBg}

          resizeMode="cover"

        />

        <Image

          source={require('../assets/bgdna.png')}

          style={styles.headerPatternBg}

          resizeMode="contain"

        />

      </View>



      {/* Footer Gradient */}

      <View style={styles.footerContainer}>

        <Image

          source={require('../assets/Header.png')}

          style={styles.footerGradientBg}

          resizeMode="cover"

        />

        <Image

          source={require('../assets/bgdna.png')}

          style={styles.footerPatternBg}

          resizeMode="contain"

        />



        {/* Continue Button */}

        <TouchableOpacity style={styles.continueButton}>

          <Text style={styles.continueButtonText}>Continue</Text>

        </TouchableOpacity>

      </View>



      {/* --- CONTENT LAYER --- */}

      <ScrollView

        contentContainerStyle={styles.scrollContent}

        showsVerticalScrollIndicator={false} // <--- THIS HIDES THE SIDE SCROLL BAR

      >

       

        {/* 1. Top Navigation Row: Back Arrow + Progress Plates */}

        <View style={styles.topNavRow}>

          <TouchableOpacity style={styles.backButton}>

            <Icon name="arrow-left" size={28} color="#000" />

          </TouchableOpacity>



          {/* The "Plates" (Progress Bar) */}

          <View style={styles.progressContainer}>

            <View style={[styles.progressPlate, styles.activePlate]} />

            <View style={styles.progressPlate} />

            <View style={styles.progressPlate} />

            <View style={styles.progressPlate} />

          </View>

         

          {/* Empty View to balance the row layout */}

          <View style={{ width: 28 }} />

        </View>



        {/* 2. Centered Title */}

        <Text style={styles.screenTitle}>Add Person</Text>



        {/* Profile Picture Section */}

        <View style={styles.profilePictureSection}>

          <Image

            source={require('../assets/doc.webp')}

            style={styles.profilePicture}

            resizeMode="cover"

          />

          {/* Camera Button is completely removed from here */}

        </View>



        {/* Input Fields */}

        <View style={styles.inputContainer}>

         

          {/* Name - Icon: Account Circle (Profile) */}

          <View style={styles.inputRowFullWidth}>

            <Icon name="account-circle-outline" size={24} color="#7B1FA2" style={styles.inputIcon} />

            <TextInput

              style={styles.inputField}

              placeholder="Name"

              placeholderTextColor="#7B1FA2"

              value={name}

              onChangeText={setName}

            />

          </View>



          <View style={styles.inputRowHalfWidthContainer}>

            {/* Age - Icon: Calendar Account (Age/DOB) */}

            <View style={styles.inputRowHalfWidth}>

              <Icon name="calendar-account-outline" size={22} color="#7B1FA2" style={styles.inputIcon} />

              <TextInput

                style={styles.inputField}

                placeholder="Age"

                placeholderTextColor="#7B1FA2"

                value={age}

                onChangeText={setAge}

                keyboardType="numeric"

              />

            </View>



            {/* Gender - Icon: Male/Female Symbol */}

            <View style={styles.inputRowHalfWidth}>

              <Icon name="gender-male-female" size={22} color="#7B1FA2" style={styles.inputIcon} />

              <TextInput

                style={styles.inputField}

                placeholder="Gender"

                placeholderTextColor="#7B1FA2"

                value={gender}

                onChangeText={setGender}

              />

            </View>

          </View>



          {/* Language - Icon: Translate/Language */}

          <View style={styles.inputRowFullWidth}>

            <Icon name="translate" size={24} color="#7B1FA2" style={styles.inputIcon} />

            <TextInput

              style={styles.inputField}

              placeholder="Select Language"

              placeholderTextColor="#7B1FA2"

              value={language}

              onChangeText={setLanguage}

            />

          </View>



          {/* bgdna below Select Language */}

          <Image

            source={require('../assets/bgdna.png')}

            style={styles.bgdnaBelowLanguage}

            resizeMode="contain"

          />

        </View>

      </ScrollView>

    </SafeAreaView>

  );

};



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#F9EAF4',

  },

  headerContainer: {

    position: 'absolute',

    top: 0,

    width: '100%',

    height: 200,

  },

  headerGradientBg: {

    width: '100%',

    height: '100%',

  },

  headerPatternBg: {

    position: 'absolute',

    width: '100%',

    height: '100%',

    opacity: 0.6,

    top: -20,

  },

  footerContainer: {

    position: 'absolute',

    bottom: 0,

    width: '100%',

    height: 150,

    justifyContent: 'center',

    alignItems: 'center',

  },

  footerGradientBg: {

    width: '100%',

    height: '100%',

    transform: [{ rotate: '180deg' }],

  },

  footerPatternBg: {

    position: 'absolute',

    width: '100%',

    height: '100%',

    opacity: 0.6,

    top: height * 0.6,

  },

  bgdnaBelowLanguage: {

    width: '100%',

    height: 250,

    opacity: 0.7,

    marginTop: 20,

  },

  scrollContent: {

    paddingHorizontal: 20,

    paddingBottom: 40,

  },

 

  // --- Header Styles ---

  topNavRow: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 50,

    marginBottom: 10,

  },

  backButton: {

    padding: 5,

  },

  progressContainer: {

    flexDirection: 'row',

    gap: 6,

  },

  progressPlate: {

    width: 40,

    height: 5,

    borderRadius: 3,

    backgroundColor: '#D1C4E9',

  },

  activePlate: {

    backgroundColor: '#7B1FA2',

  },

  screenTitle: {

    fontSize: 24,

    fontWeight: 'bold',

    color: '#330066',

    textAlign: 'center',

    marginBottom: 20,

  },



  profilePictureSection: {

    alignItems: 'center',

    marginBottom: 30,

  },

  profilePicture: {

    width: 100,

    height: 100,

    borderRadius: 50,

    borderWidth: 2,

    borderColor: '#fff',

  },



  inputContainer: {

    marginBottom: 30,

  },

  inputRowFullWidth: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F3E5F5',

    borderRadius: 10,

    paddingHorizontal: 10,

    paddingVertical: 12,

    marginBottom: 15,

  },

  inputRowHalfWidthContainer: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 15,

  },

  inputRowHalfWidth: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F3E5F5',

    borderRadius: 10,

    paddingHorizontal: 10,

    paddingVertical: 12,

    width: '48%',

  },

  inputIcon: {

    marginRight: 10,

  },

  inputField: {

    flex: 1,

    fontSize: 16,

    color: '#7B1FA2',

  },

  continueButton: {

    backgroundColor: '#9062df',

    paddingVertical: 15,

    borderRadius: 10,

    alignItems: 'center',

    width: '90%',

    position: 'absolute',

    top: 50,

  },

  continueButtonText: {

    fontSize: 16,

    fontWeight: '600',

    color: '#fff',

  },

});



export default AddPersonScreen;
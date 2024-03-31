import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Pressable, StyleSheet, View} from 'react-native';
import Portfolio from '../screens/loggedIn/investments/portfolio/portfolio';
import SettingsComponent from '../screens/settings/settings';
import Investments from '../screens/loggedIn/investments/investments';
import FastImage from 'react-native-fast-image';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const Tab = createBottomTabNavigator();

function MainFlowStack() {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {backgroundColor: 'black', borderTopWidth: 0},
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          listeners={() => ({
            tabPress: () => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
            },
          })}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <FastImage
                  source={require(`./navbar-images/home-selected.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/home.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ),
          }}
          name="Home"
          component={Portfolio}
        />
        <Tab.Screen
          listeners={() => ({
            tabPress: () => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
            },
          })}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <FastImage
                  source={require(`./navbar-images/markets-selected.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/markets.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ),
          }}
          name="Investments"
          component={Investments}
        />
        <Tab.Screen
          listeners={() => ({
            tabPress: () => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
            },
          })}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <FastImage
                  source={require(`./navbar-images/profile-selected.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/profile.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ),
          }}
          name="Settings"
          component={SettingsComponent}
        />
      </Tab.Navigator>
    </View>
  );
}

export default MainFlowStack;

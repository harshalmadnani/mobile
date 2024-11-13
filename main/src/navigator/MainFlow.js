import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Pressable, StyleSheet, View} from 'react-native';
import Portfolio from '../screens/loggedIn/investments/portfolio/portfolio';
import AIScreen from '../screens/loggedIn/AIScreen';
import SettingsComponent from '../screens/settings/settings';
import Investments from '../screens/loggedIn/investments/investments';
import FastImage from 'react-native-fast-image';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useRoute} from '@react-navigation/native';
import Spending from '../screens/loggedIn/spending/spending';
const Tab = createBottomTabNavigator();

function MainFlowStack({navigation}) {
  const route = useRoute();
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  console.log(navigation.getState().routes);
  // Function to determine if tab bar should be visible
  const getTabBarVisibility = () => {
    if (route.name != 'Catelog') return '';
    else {
      return 'none';
    }
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'black',
            borderTopWidth: 0,
            display: getTabBarVisibility(),
          },
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
            tabBarLabel: 'AI',
            tabBarIcon: ({focused, color, size}) =>
              focused ? (
                <FastImage
                  source={require(`./navbar-images/ai-selected.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/ai.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ),
          }}
          name="AI"
          component={AIScreen}
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
                  source={require(`./navbar-images/savings-selected.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/savings.png`)}
                  style={{
                    color: '#9D9D9D',
                    width: 24,
                    height: 24,
                  }}
                />
              ),
          }}
          name="Spending"
          component={Spending}
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

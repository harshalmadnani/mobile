import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {StatusBar} from 'react-native';
import Spending from '../screens/loggedIn/spending/spending';
import Catelog from '../screens/loggedIn/spending/catalog';

const Stack = createNativeStackNavigator();

function SpendingFlow() {
  return (
    <Stack.Navigator
      initialRouteName="Spending"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Spending" component={Spending} />
      <Stack.Screen name="Catelog" component={Catelog} />
    </Stack.Navigator>
  );
}

export default SpendingFlow;

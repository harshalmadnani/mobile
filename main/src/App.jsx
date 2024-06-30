import './polyfills';
import '@walletconnect/react-native-compat';
import {WagmiConfig} from 'wagmi';
import {
  polygon,
  base,
  celo,
  avalanche,
  bsc,
  gnosis,
  optimism,
  arbitrum,
} from 'viem/chains';

import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from '@web3modal/wagmi-react-native';

import {createPublicClient, http} from 'viem';
import {mainnet} from 'viem/chains';

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootSiblingParent} from 'react-native-root-siblings';
import {Buffer} from 'buffer';
import ChangeCurrency from './screens/settings/changeCurrency';
const publicClient = createPublicClient({
  // chain: mainnet,
  transport: http(
    'https://polygon-mainnet.g.alchemy.com/v2/TjxOaj0jbq-FVA2jFK2p_h_KnrooFuHg',
  ),
  chain: polygon,
});
global.Buffer = Buffer;
import './global';
import {
  Image,
  View,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Referrals from './screens/loggedIn/referrals';
import BottomNavbar from './screens/navbar';
import StaticHomeScreen from './screens/loggingIn/home';
import PreLoad from './screens/loggingIn/load';
import Name from './screens/loggingIn/name';
import Countdown from './screens/loggedIn/countdown/countdown';
import QRPage from './screens/loggedIn/qr/qr';
import Investments from './screens/loggedIn/investments/investments';
import SavingsComponent from './screens/loggedIn/savings/savings';
import PaymentsComponent from './screens/loggedIn/payments/payments';
import Transaction from './screens/loggedIn/payments/transactions/transactions';
import TransactionList from './screens/loggedIn/transactions/transactionList';
import EnterAmountComponent from './screens/enterAmount';
import EnterSavingsAmountComponent from './screens/loggedIn/savings/savingStatus/enterSavingsAmount';
import SendEmailComponent from './screens/loggedIn/send/sendEmail';
import SendMobileComponent from './screens/loggedIn/send/sendMobile';
import SendWalletComponent from './screens/loggedIn/send/sendWallet';
import {Text} from 'react-native-elements';
import TopBar from './screens/loggedIn/topbar';
import Pending from './screens/loggedIn/txStatus/pending';
import {Provider} from 'react-redux';
import Successful from './screens/loggedIn/txStatus/successful';
import Unsuccessful from './screens/loggedIn/txStatus/unsuccessful';
import MarketInfo from './screens/loggedIn/investments/marketInfo';
import SavingsPending from './screens/loggedIn/savings/savingStatus/pending';
import SavingsSuccessful from './screens/loggedIn/savings/savingStatus/successful';
import PendingTxStatusPage from './screens/loggedIn/investments/trade/PendingTxStatusPage';
import NewAuthFlow from './screens/loggingIn/NewAuthFlow';
import MainFlowStack from './navigator/MainFlow';
// import SavingsUnsuccessful from './screens/loggedIn/savings/savingStatus/unsuccessful';
import Ramper from './screens/loggedIn/payments/Ramps/ramper';
import LiFi from './screens/loggedIn/payments/Ramps/lifi';
import PreRegister from './screens/loggedIn/spending/PreRegister';
import Uniramp from './screens/loggedIn/payments/Ramps/uniramp';
import SettingsComponent from './screens/settings/settings';
import NFT from './screens/loggedIn/nft';
import Card from './screens/loggedIn/card';

import RedeemPoints from './screens/loggedIn/redeem/redeem';
import RedeemForm from './screens/loggedIn/redeem/redeem-widget';

import ReferralCode from './screens/loggingIn/referCode';

const Stack = createNativeStackNavigator();

const bg = require('./../assets/bg.png');
const particle = require('./../assets/particle.jpg');
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

import messaging from '@react-native-firebase/messaging';
import {requestUserPermission, generateTopic} from './utils/push';
import {getDeviceToken} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import AddBankAccount from './screens/loggedIn/card/bankAccount/addBankAccount';
import ListBankAccounts from './screens/loggedIn/card/bankAccount/listBankAccount';
import AddFund from './screens/loggedIn/card/fund/addFund';
import CardInfo from './screens/loggedIn/card/info/cardInfo';
import TradePage from './screens/loggedIn/investments/trade/tradePage';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './store/store';
import SuccessTxStatusPage from './screens/loggedIn/investments/trade/SuccesTxStatusPage';
import MarketSearchScreen from './screens/loggedIn/investments/MaketSearchScreen';
import * as Sentry from '@sentry/react-native';
import DinariKycWebview from './screens/stocks/KYCFlow/DinariKycWebview';
import AnyTokenListScreen from './screens/loggedIn/send/AnyTokenList';
// import {register} from 'module';
const projectId = 'cb6fc19a389caeab31f49d301b87ad73';

// 2. Create config
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const chains = [
  mainnet,
  polygon,
  base,
  celo,
  avalanche,
  bsc,
  gnosis,
  optimism,
  arbitrum,
];

const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation({
  enableTimeToInitialDisplay: true,
});
Sentry.init({
  dsn: 'https://1b1bbd962e5ed53341f84c3a6389bc8f@o4506999411703808.ingest.us.sentry.io/4506999413407744',
  enableAutoSessionTracking: true,
  // Sessions close after app is 10 seconds in the background.
  sessionTrackingIntervalMillis: 20000,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.ReactNativeTracing(routingInstrumentation)],
});

function PreLaunchLoad({navigation}) {
  return (
    <View>
      <PreLoad navigation={navigation} />
    </View>
  );
}

// function ChooseWallet({navigation}) {
//   return (
//     <View>
//       <ChooseConnect navigation={navigation} />
//     </View>
//   );
// }

function EnterName({navigation, route}) {
  return (
    <View>
      <Name route={route} navigation={navigation} />
    </View>
  );
}

function WidgetPage({navigation}) {
  return (
    <View>
      <FiatWidgetComponent navigation={navigation} />
    </View>
  );
}

function LoggedIn({navigation}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <Countdown navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function Connected({navigation}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <Countdown navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function Error({navigation}) {
  return (
    <ImageBackground source={particle} style={styles.bg}>
      <SafeAreaView>
        <View>
          <Text style={styles.text}>Error...</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.push('Home')}
          />
          <Text style={styles.buttonText}>Try Again</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Loading({navigation}) {
  return (
    <View style={{width: '100%', backgroundColor: '#0C0C0C', height: '100%'}}>
      <SafeAreaView>
        <Text
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            marginTop: '63%',
            fontSize: 50,
            fontFamily: 'LemonMilk-Regular',
          }}>
          XADE
        </Text>
        <View
          style={{
            marginTop: '15%',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={30} style={styles.loader} color="#fff" />
          <Text
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              fontSize: 18,
              marginTop: '5%',
              fontFamily: `EuclidCircularA-Medium`,
            }}>
            {'  '}
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ComingSoon({navigation}) {
  return (
    <View source={particle} style={[styles.bg, {backgroundColor: 'black'}]}>
      <ScrollView>
        <SafeAreaView style={{alignItems: 'center', justifyContent: 'center'}}>
          <FastImage
            source={require('./cat.png')}
            style={{
              width: windowWidth / 1.3,
              height: windowHeight / 3,
              marginTop: 100,
            }}
          />
          <View>
            <Text style={styles.comingSoonText}>Coming Soon...</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
      <BottomNavbar navigation={navigation} selected="ComingSoon" />
    </View>
  );
}
function Savings({navigation, route}) {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} headers={'Savings'} />
      <ScrollView style={[styles.content, {zIndex: -1}]}>
        <SavingsComponent navigation={navigation} route={route} />
      </ScrollView>
      <BottomNavbar navigation={navigation} selected="Savings" />
    </SafeAreaView>
  );
}

function MarketSearch({navigation, route}) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <MarketSearchScreen route={route} navigation={navigation} />
      </SafeAreaView>
    </View>
  );
}
// function AnyTokenList({navigation, route}) {
//   return <AnyTokenListScreen route={route} navigation={navigation} />;
// }
function Payments({navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const reload = React.useCallback(async () => {
    await onRefresh();
    await navigation.push('Payments');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} headers={'Home'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[styles.content, {zIndex: -1}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={reload}
            tintColor={'#fff'}
          />
        }>
        <PaymentsComponent navigation={navigation} />
      </ScrollView>
      <BottomNavbar navigation={navigation} selected="Payments" />
    </SafeAreaView>
  );
}

function Redeem({navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const reload = React.useCallback(async () => {
    await onRefresh();
    await navigation.push('Redeem');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} headers={'Store'} />
      <ScrollView
        style={[styles.content, {zIndex: -1}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={reload}
            tintColor={'#fff'}
          />
        }>
        <RedeemPoints navigation={navigation} />
      </ScrollView>
      <BottomNavbar navigation={navigation} selected="Redeem" />
      {/* </View> */}
    </SafeAreaView>
  );
}

function EnterAmount({navigation, route}) {
  return (
    // <ScrollView>
    <View style={styles.black}>
      {/* <SafeAreaView>   */}
      {/* <View> */}
      <EnterAmountComponent navigation={navigation} route={route} />
      {/* </View> */}
      {/* </SafeAreaView> */}
    </View>
  );
}

function EnterSavingsAmount({navigation, route}) {
  return (
    // <ScrollView>
    <View style={styles.black}>
      {/* <SafeAreaView>   */}
      {/* <View> */}
      <EnterSavingsAmountComponent navigation={navigation} route={route} />
      {/* </View> */}
      {/* </SafeAreaView> */}
    </View>
  );
}
function MarketInfoScreen({route, navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <MarketInfo navigation={navigation} item={route?.params?.item} />
    </SafeAreaView>
  );
}
function TradePageScreen({route, navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <TradePage navigation={navigation} route={route} />
    </SafeAreaView>
  );
}
function PendingTxStatusScreen({route, navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{height: '100%'}}>
        <PendingTxStatusPage navigation={navigation} route={route} />
      </ScrollView>
    </SafeAreaView>
  );
}
function SuccessTxStatusScreen({route, navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{height: '100%'}}>
        <SuccessTxStatusPage navigation={navigation} route={route} />
      </ScrollView>
    </SafeAreaView>
  );
}
function SendEmail({navigation}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <SendEmailComponent navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function SendMobile({navigation}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <SendMobileComponent navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function SendWallet({navigation}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <SendWalletComponent navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function XadeCard({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} headers={'Card'} />
      <ScrollView style={{height: '100%'}}>
        <Card navigation={navigation} />
      </ScrollView>
      <BottomNavbar navigation={navigation} selected="Card" />
    </SafeAreaView>
  );
}

function AddFundToCard({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <TopBar navigation={navigation} headers={'Bank Account'} /> */}
      <ScrollView style={{height: '100%'}}>
        <AddFund navigation={navigation} />
      </ScrollView>
      {/* <BottomNavbar navigation={navigation} selected="Card" /> */}
    </SafeAreaView>
  );
}

function CardInfoScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <TopBar navigation={navigation} headers={'Bank Account'} /> */}
      <ScrollView style={{height: '100%'}}>
        <CardInfo navigation={navigation} />
      </ScrollView>
      {/* <BottomNavbar navigation={navigation} selected="Card" /> */}
    </SafeAreaView>
  );
}

function CreateBankAccount({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <TopBar navigation={navigation} headers={'Bank Account'} /> */}
      <ScrollView style={{height: '100%'}}>
        <AddBankAccount navigation={navigation} />
      </ScrollView>
      {/* <BottomNavbar navigation={navigation} selected="Card" /> */}
    </SafeAreaView>
  );
}

function ListBankAccount({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <TopBar navigation={navigation} headers={'Bank Account'} /> */}
      <ScrollView style={{height: '100%'}}>
        <ListBankAccounts navigation={navigation} />
      </ScrollView>
      {/* <BottomNavbar navigation={navigation} selected="Card" /> */}
    </SafeAreaView>
  );
}

function ViewTransaction({navigation, route}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <Transaction navigation={navigation} route={route} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function TransactionHistory({navigation, route}) {
  return (
    <View style={styles.black}>
      {/* <SafeAreaView>
        <ScrollView> */}
      <View>
        <TransactionList navigation={navigation} route={route} />
      </View>
      {/* </ScrollView>
      </SafeAreaView> */}
      <BottomNavbar navigation={navigation} selected="TransactionHistory" />
    </View>
  );
}

function ReferCode({navigation}) {
  return (
    <ScrollView>
      <View style={styles.black}>
        <SafeAreaView>
          <View>
            <ReferralCode navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

function App({navigation, uri}) {
  useEffect(() => {
    async function preLaunchChecks() {
      await requestUserPermission();
      await generateTopic();

      messaging().onNotificationOpenedApp(remoteMessage => {});
      messaging().onMessage(async remoteMessage => {
        console.log('notification on foreground state.......', remoteMessage);
      });
    }

    preLaunchChecks();
  }, []);
  const navigationRef = React.useRef();

  return (
    <Sentry.ErrorBoundary>
      <WagmiConfig config={wagmiConfig}>
        <RootSiblingParent>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  routingInstrumentation.registerNavigationContainer(
                    navigationRef,
                  );
                }}
                screenOptions={{animationEnabled: false}}>
                <Stack.Navigator screenOptions={{animation: 'none'}}>
                  <Stack.Screen
                    name="Home"
                    component={PreLaunchLoad}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="LoggedOutHome"
                    component={StaticHomeScreen}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="NewAuthFlow"
                    component={NewAuthFlow}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="EnterName"
                    component={EnterName}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="MarketInfo"
                    component={MarketInfoScreen}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  {/* <Stack.Screen
                    name="ChooseConnect"
                    component={ChooseWallet}
                    navigation={navigation}
                    options={{headerShown: false}}
                  /> */}
                  <Stack.Screen
                    name="LoggedIn"
                    component={LoggedIn}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Connected"
                    component={Connected}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Error"
                    component={Error}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Loading"
                    component={Loading}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="ComingSoon"
                    component={ComingSoon}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="NFT"
                    component={NFT}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="QRScreen"
                    component={QRPage}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="Portfolio"
                    component={MainFlowStack}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Savings"
                    component={Savings}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Payments"
                    component={Payments}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="EnterAmount"
                    component={EnterAmount}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="EnterSavingsAmount"
                    component={EnterSavingsAmount}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SendEmail"
                    component={SendEmail}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Ramper"
                    component={Ramper}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="Uniramp"
                    component={Uniramp}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="DinariKycWebview"
                    component={DinariKycWebview}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="LiFi"
                    component={LiFi}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="PreRegister"
                    component={PreRegister}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SendMobile"
                    component={SendMobile}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SendWallet"
                    component={SendWallet}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Pending"
                    component={Pending}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="TradePage"
                    component={TradePageScreen}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="PendingTxStatus"
                    component={PendingTxStatusScreen}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SuccessTxStatus"
                    component={SuccessTxStatusScreen}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Successful"
                    component={Successful}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Unsuccessful"
                    component={Unsuccessful}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SavingsPending"
                    component={SavingsPending}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SavingsSuccessful"
                    component={SavingsSuccessful}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="WidgetPage"
                    component={WidgetPage}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Referrals"
                    component={Referrals}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="ViewTransaction"
                    component={ViewTransaction}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="TransactionHistory"
                    component={TransactionHistory}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Redeem"
                    component={Redeem}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RedeemForm"
                    component={RedeemForm}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Card"
                    component={XadeCard}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="ReferralCode"
                    component={ReferCode}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="CreateBankAccount"
                    component={CreateBankAccount}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="ListBankAccount"
                    component={ListBankAccount}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="MarketSearch"
                    component={MarketSearch}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="AddFund"
                    component={AddFundToCard}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="CardInfo"
                    component={CardInfoScreen}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="ChangeCurrency"
                    component={ChangeCurrency}
                    navigation={navigation}
                    options={{headerShown: false}}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </PersistGate>
          </Provider>
        </RootSiblingParent>
        <Web3Modal />
      </WagmiConfig>
    </Sentry.ErrorBoundary>
  );
}
export default Sentry.wrap(App);
const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  loader: {
    marginTop: '80%',
  },

  text: {
    color: '#e8ff59',
    fontFamily: 'NeueMachina-UltraBold',
    fontSize: 25,
    marginTop: '5%',
    textAlign: 'center',
  },

  comingSoonText: {
    color: '#fff',
    fontFamily: 'Benzin-Medium',
    fontSize: 35,
    textAlign: 'center',
    marginTop: '20%',
  },

  button: {
    width: '50%',
    color: '#000',
    borderRadius: 10,
    marginLeft: '25%',
    marginTop: '20%',
    padding: '7%',
    backgroundColor: '#E8FF59',
    marginBottom: '5%',
  },

  buttonText: {
    color: '#000',
    fontFamily: 'VelaSans-Bold',
    fontSize: 20,
    marginTop: '-15.5%',
    marginLeft: '38%',
  },

  walletButton: {
    width: '50%',
    color: '#000',
    borderRadius: 10,
    marginLeft: '26%',
    marginTop: '90%',
    padding: '5%',
    backgroundColor: '#E8FF59',
    marginBottom: '5%',
  },

  walletButtonText: {
    color: '#000',
    fontFamily: 'VelaSans-Bold',
    fontSize: 17,
    marginTop: '-1%',
    marginLeft: '15%',
  },

  logoutext: {
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 20,
    textAlign: 'center',
  },

  logout: {
    width: '100%',
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 20,
    marginTop: '67%',
  },

  black: {
    height: windowHeight,
    backgroundColor: '#000000',
  },

  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    // flex: 1,
  },
});

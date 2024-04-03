import {React, useState, useEffect} from 'react';
import {SafeAreaView, FlatList, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MyInvestmentItemCard from './myInvestmentItemCard'; // Assuming this is the path to your component
import {getCryptoHoldingForAddress} from '../../../../utils/cryptoWalletApi';
const MyInvestments = ({navigation}) => {
  // Assuming 'holdings' is passed as a prop to this component, containing an array of assets
  const [holdings, setHoldings] = useState();
  console.log('Holdings', holdings);
  const address = useSelector(x => x.auth.address);
  useEffect(() => {
    async function init() {
      try {
        const data = await getCryptoHoldingForAddress(address);
        console.log('Data from API', data);
        setHoldings(data);

        // fetch selected coin contract address
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, []);
  if (!holdings || !holdings.assets) {
    // If holdings or holdings.assets don't exist, you can return a loading indicator or null
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={
          holdings?.assets.length > 0
            ? holdings?.assets?.filter(item => item?.token_balance > 0)
            : []
        }
        keyExtractor={item => item.asset.id} // Use a unique property of each asset as the key
        renderItem={({item}) => (
          <MyInvestmentItemCard
            navigation={navigation}
            item={{
              ...item.asset, // Assuming the structure matches what MyInvestmentItemCard expects
              balance: item.token_balance, // Adapt properties as needed
              current_price: item.price,
              price_change_percentage_24h:
                item.asset.price_change_percentage_24h, // Example
              image: item.asset.logo, // Assuming there's an 'image' property
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Match the background color
    paddingBottom: '30%',
  },
});

export default MyInvestments;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import {useSelector} from 'react-redux';
const NFTScreen = ({ navigation }) => {
    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const evmInfo = useSelector(x => x.portfolio.evmInfo);
    useEffect(() => {
      const url = `https://api.mobula.io/api/1/wallet/nfts?wallet=${evmInfo?.smartAccount}`;
      
      axios.get(url)
        .then(response => {
          const imageData = response.data.data.map(nft => {
            const metadata = JSON.parse(nft.metadata);
            return { ...nft, imageUrl: metadata.image };
          });
          setNfts(imageData);
          setIsLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setIsLoading(false);
        });
    }, []);
  
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name='navigate-before'
            size={30}
            color='#f0f0f0'
            type='materialicons'
            onPress={() => navigation.goBack()}
            style={styles.icon}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Collectibles</Text>
          </View>
        </View>
        <FlatList
          data={nfts}
          numColumns={2}
          keyExtractor={item => item.token_id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') }} style={styles.image} />
              <Text style={styles.nameText}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    );
  };
const styles = StyleSheet.create({
    container: {
      flex: 1,
 backgroundColor:'#000',
 paddingHorizontal:'5%'
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000'
    },
    loadingText: {
      color: '#fff'
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    errorText: {
      color: 'red'
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
    },
    icon: {
      marginLeft: 10
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      marginRight: 30
    },
    titleText: {
      color: '#F0F0F0',
      fontFamily: 'NeueMontreal-Medium',
      fontSize: 16,
      textAlign: 'center'
    },
    itemContainer: {
      flex: 1,
      alignItems: 'center',
      margin: '4%', 
      backgroundColor: 'rgba(64, 64, 64, 0.5)',
      borderRadius:30
    },
    image: {
      width: 120,
      height: 120,
      borderRadius:20
    },
    nameText: {
      color: '#F0F0F0',
      fontSize: 14,
      fontFamily:'NeueMontreal-Medium',
      textAlign: 'center',
      marginTop: '3%',
      marginHorizontal:'5%'
    }
  });
  

export default NFTScreen;

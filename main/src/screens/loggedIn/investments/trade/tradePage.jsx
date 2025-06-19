import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  useAccount,
  useBalance,
  useNetwork,
} from 'wagmi';
import {useDispatch, useSelector} from 'react-redux';

import {ethers} from 'ethers';
import portfolioStyles from '../investment-styles';
import {setTxState} from '../../../../store/actions/portfolio';
// import {onGetGasFee} from '../backend/viewFunctions';
// import {onContribute, onWithdraw} from '../backend/txFunctions';
import {useEthersSigner} from '../../../../utils/ethers';
import {useSwitchNetwork} from 'wagmi';

const TX_STATE = {
  NONE: 'NONE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const TradePage = ({route, navigation}) => {
  const {isSell, card} = route.params;
  const dispatch = useDispatch();
  const {address} = useAccount();
  const {chain} = useNetwork();
  const {switchNetwork} = useSwitchNetwork();
  const signer = useEthersSigner({chainId: chain?.id});
  const {data: balance} = useBalance({
    address: address,
    token: isSell ? undefined : card.investmentToken.address, // if sell, native, else investment token
    chainId: Number(chain?.id),
  });

  const {txState} = useSelector(state => state.portfolio);
  const [amount, setAmount] = useState('0.0');
  const [fee, setFee] = useState(null);

  const onContinue = async () => {
    if (
      !isSell &&
      (Number(amount) < card.minInvestment || Number(amount) === 0)
    ) {
      Alert.alert(
        `Please enter an amount greater than ${card.minInvestment}`,
      );
      return;
    }
    if (isSell && Number(amount) === 0) {
      Alert.alert('Please enter an amount greater than 0');
      return;
    }

    if (chain.id !== card.chain) {
      switchNetwork(card.chain);
      return;
    }

    if (!signer) {
      Alert.alert('Please connect your wallet');
      return;
    }

    try {
      dispatch(setTxState(TX_STATE.LOADING));
      const contract = new ethers.Contract(card.address, card.abi, signer);
      // if (!isSell) {
      //   await onContribute(
      //     contract,
      //     card.investmentToken,
      //     amount,
      //     address,
      //     dispatch,
      //   );
      // } else {
      //   await onWithdraw(contract, amount, dispatch);
      // }
      navigation.goBack();
    } catch (e) {
      console.log(e);
      dispatch(setTxState(TX_STATE.NONE));
    }
  };

  useEffect(() => {
    // onGetGasFee(card.chain).then(res => {
    //   setFee(res);
    // });
  }, [card]);

  return (
    <View style={portfolioStyles.container}>
      <View style={portfolioStyles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            dispatch(setTxState(TX_STATE.NONE));
          }}>
          <Icon name="arrow-back" type="material" color={'#FFFFFF'} />
        </TouchableOpacity>
        <Text style={portfolioStyles.title}>
          {isSell ? 'Sell' : 'Invest'} {card.name}
        </Text>
      </View>

      <View style={portfolioStyles.cardContainer}>
        <Text style={portfolioStyles.balance}>
          Balance: {Number(balance?.formatted).toFixed(2)} {balance?.symbol}
        </Text>

        <TextInput
          style={portfolioStyles.input}
          placeholder="0.00"
          placeholderTextColor={'#808080'}
          keyboardType="numeric"
          value={amount}
          onChangeText={text => setAmount(text)}
        />
        <Text style={portfolioStyles.token}>
          {isSell ? card.name : card.investmentToken.symbol}
        </Text>
      </View>

      <View style={portfolioStyles.infoContainer}>
        <View style={portfolioStyles.infoRow}>
          <Text style={portfolioStyles.infoTitle}>Network</Text>
          <Text style={portfolioStyles.infoValue}>{card.chainName}</Text>
        </View>

        <View style={portfolioStyles.infoRow}>
          <Text style={portfolioStyles.infoTitle}>Gas Fee</Text>
          <Text style={portfolioStyles.infoValue}>
            {fee ? `$${fee}` : 'Loading...'}
          </Text>
        </View>

        <View style={portfolioStyles.infoRow}>
          <Text style={portfolioStyles.infoTitle}>
            {isSell ? 'You will recieve' : 'You will invest'}
          </Text>
          <Text style={portfolioStyles.infoValue}>
            {amount} {isSell ? card.investmentToken.symbol : card.name}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={portfolioStyles.button}
        onPress={() => {
          onContinue();
        }}>
        {txState === TX_STATE.LOADING ? (
          <ActivityIndicator color={'#FFFFFF'} />
        ) : (
          <Text style={portfolioStyles.buttonText}>
            {chain?.id !== card.chain ? 'Switch Network' : 'Continue'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TradePage;

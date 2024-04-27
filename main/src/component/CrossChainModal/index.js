import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, Pressable} from 'react-native';
import {W3mButton} from '@web3modal/wagmi-react-native';
import erc20 from '../../screens/loggedIn/payments/USDC.json';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareSendTransaction,
} from 'wagmi';
import {ethers} from 'ethers';
import {getQuoteFromLifi} from '../../utils/DLNTradeApi';
import {
  getAllSupportedChainsFromSwing,
  getApprovalCallDataFromSwing,
  getQuoteFromSwing,
  getTxCallDataFromSwing,
} from '../../utils/SwingCrossDepositsApi';
import LottieView from 'lottie-react-native';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import {useDispatch, useSelector} from 'react-redux';
import {Image} from 'react-native';
import {getChainsSupportedFromSquid} from '../../utils/SquidCrossChainTradeApi';
import {useNavigation} from '@react-navigation/native';
import {depositAction} from '../../store/reducers/deposit';
const CrossChainModal = ({modalVisible, setModalVisible, value}) => {
  // renders
  const {address, isConnecting, isDisconnected} = useAccount();
  const [txInfo, setTxInfo] = useState('wallet');
  const [txHashToPoll, setTxHashToPoll] = useState(false);
  const {config} = usePrepareSendTransaction(txInfo);
  const {
    data: sendTxData,
    isLoading: sendTransactionLoading,
    isSuccess,
    sendTransactionAsync,
  } = useSendTransaction(config);
  const {data: transactionData} = useWaitForTransaction(sendTxData);
  const [assets, setAssets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [step, setStep] = useState('wallet');
  const [readyToExecute, setReadyToExecute] = useState(false);
  const [assetType, setAssetType] = useState(false);
  const nextTxToBeExecuted = useSelector(x => x.deposit.txToBeExecuted);
  const dispatch = useDispatch();
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const navigation = useNavigation();
  const createApprovalTransaction = (to, amount) => {
    const erc20Abi = new ethers.Interface(erc20);
    const approveData = erc20Abi.encodeFunctionData('approve', [to, amount]);
    return approveData;
  };
  useEffect(() => {
    if (readyToExecute) {
      console.log('readyyy to tx!!!!');
      sendTransactionAsync?.();
      setReadyToExecute(false);
      console.log('asset loading!!!!', sendTransactionLoading);
    }
  }, [readyToExecute]);

  console.log('tx next to fire.....', sendTxData, transactionData?.blockHash);
  useEffect(() => {
    console.log(
      'tx change firedddd',
      transactionData?.status,
      transactionData?.blockHash,
    );
    if (transactionData?.status === 'success') {
      console.log(
        'tx change firedddd',
        transactionData?.status,
        transactionData?.blockHash,
      );
      if (!nextTxToBeExecuted) {
        navigation.navigate('Portfolio');
      } else {
        console.log('Next Tx to Execute.......', nextTxToBeExecuted);
        setTxInfo({
          ...nextTxToBeExecuted,
          onSuccess(data) {
            setReadyToExecute(true);
          },
        });
        dispatch(depositAction.setTxToBeExecuted(false));
      }
    } else {
      console.log('Tx Reverted.......');
    }
  }, [transactionData]);
  useEffect(() => {
    if (sendTxData?.hash) {
      console.log('got the hash...........', transactionData);
    }
  }, [sendTxData]);
  useEffect(() => {
    const ws = new W3CWebSocket(
      'wss://portfolio-api-wss-fgpupeioaa-uc.a.run.app',
    );
    if (address) {
      ws.onopen = () => {
        const payload = {
          type: 'wallet',
          authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99',
          payload: {
            wallet: address,
            interval: 15,
          },
        };

        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = event => {
        const parsedValue = JSON.parse(event?.data)?.assets;
        setAssets(parsedValue);
        setStep('asset');
      };

      ws.onerror = event => {
        console.error('WebSocket error:', event);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
    return () => {
      ws.close();
    };
  }, [address]);

  const executeSwapFlow = async asset => {
    console.log('chain.....', asset?.contracts_balances[0]?.id, '137');
    if (asset?.estimated_balance > value) {
      setAssetType(asset?.asset?.name);
      setAssetLoading(true);
      let usdcToTokenValue =
        (1 / asset?.price)?.toFixed(asset?.contracts_balances[0]?.decimals) *
        Math.pow(10, asset?.contracts_balances[0]?.decimals) *
        value;
      if (asset?.contracts_balances[0]?.chainId !== '137') {
        const chain = await getAllSupportedChainsFromSwing();
        console.log(chain);
        const destinationChain = chain.filter(
          x => x?.id === asset?.contracts_balances[0]?.chainId,
        );
        console.log('destination', JSON.stringify(destinationChain));

        const quote = await getQuoteFromSwing(
          {
            fromChain: destinationChain[0]?.slug,
            tokenSymbol: asset?.asset?.symbol,
            fromTokenAddress: asset?.contracts_balances[0]?.address,
            fromChainId: destinationChain[0]?.id,
          },
          {
            toChain: 'polygon',
            toTokenSymbol: 'USDC',
            toChainId: '137',
            toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          },
          address,
          evmInfo?.smartAccount,
          usdcToTokenValue,
        );

        let bestQuoteTokenOutRoute = quote.routes?.map(x =>
          parseInt(x?.quote?.amount),
        );
        console.log('bestQuoteTokenOutRoute...', bestQuoteTokenOutRoute);
        bestQuoteTokenOutRoute = Math.max(...bestQuoteTokenOutRoute);
        console.log('bestQuoteTokenOutRoute...', bestQuoteTokenOutRoute);
        bestQuoteTokenOutRoute = quote.routes.filter(
          x => parseInt(x?.quote?.amount) === bestQuoteTokenOutRoute,
        );
        if (
          asset?.contracts_balances[0]?.address ===
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ) {
          const executeTransaction = await getTxCallDataFromSwing(
            {
              fromChain: destinationChain[0]?.slug,
              tokenSymbol: asset?.asset?.symbol,
              fromTokenAddress: '0x0000000000000000000000000000000000000000',
              fromChainId: destinationChain[0]?.id,
            },
            {
              toChain: 'polygon',
              toTokenSymbol: 'USDC',
              toChainId: '137',
              toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            },
            [
              {
                bridge: bestQuoteTokenOutRoute[0]?.route[0]?.bridge,
                tokenAddress:
                  bestQuoteTokenOutRoute[0]?.route[0]?.bridgeTokenAddress,
                tokenName: bestQuoteTokenOutRoute[0]?.route[0]?.name,
                part: bestQuoteTokenOutRoute[0]?.route[0]?.part,
              },
            ],
            address,
            evmInfo?.smartAccount,
            usdcToTokenValue,
          );

          setTxInfo({
            data: executeTransaction?.tx?.data,
            to: executeTransaction?.tx?.to,
            from: executeTransaction?.tx?.from,
            value: executeTransaction?.tx?.value,
            gas: executeTransaction?.tx?.gas,
            chainId: executeTransaction?.fromChain?.chainId,
            onSuccess(data) {
              setReadyToExecute(true);
            },
          });
        } else {
          console.log(
            'approval.......',
            bestQuoteTokenOutRoute[0]?.quote?.integration,
          );
          const approval = await getApprovalCallDataFromSwing(
            {
              fromChain: destinationChain[0]?.slug,
              tokenSymbol: asset?.asset?.symbol,
              fromTokenAddress: asset?.contracts_balances[0]?.address,
              fromChainId: destinationChain[0]?.id,
            },
            {
              toChain: 'polygon',
              toTokenSymbol: 'USDC',
              toChainId: '137',
              toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            },
            address,
            bestQuoteTokenOutRoute[0]?.quote?.integration,
            usdcToTokenValue,
          );
          if (approval) {
            // console.log(
            //   'Setting transactionn....',
            //   bestQuoteTokenOutRoute[0]?.route[0],
            //   approval?.tx,
            // );

            const executeTransaction = await getTxCallDataFromSwing(
              {
                fromChain: destinationChain[0]?.slug,
                tokenSymbol: asset?.asset?.symbol,
                fromTokenAddress: asset?.contracts_balances[0]?.address,
                fromChainId: destinationChain[0]?.id,
              },
              {
                toChain: 'polygon',
                toTokenSymbol: 'USDC',
                toChainId: '137',
                toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
              },
              [
                {
                  bridge: bestQuoteTokenOutRoute[0]?.route[0]?.bridge,
                  steps: bestQuoteTokenOutRoute[0]?.route[0]?.steps,
                  tokenAddress:
                    bestQuoteTokenOutRoute[0]?.route[0]?.bridgeTokenAddress,
                  tokenName: bestQuoteTokenOutRoute[0]?.route[0]?.name,
                  part: bestQuoteTokenOutRoute[0]?.route[0]?.part,
                },
              ],
              address,
              evmInfo?.smartAccount,
              usdcToTokenValue,
            );
            // const executeTransaction = {
            //   tx: {
            //     data: '0x846a1bc60000000000000000000000007130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c00000000000000000000000000000000000000000000000000000e6e90a06ef2000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000009e00000000000000000000000000000000000000000000000000000000000000a200000000000000000000000000000000000000000000000000000000000000a600000000000000000000000000000000000000000000000000000000000000ac0000000000000000000000000c919926ceb1da03087cb02ae9b5af93dde1d23340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000003e00000000000000000000000000000000000000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000072000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000001b81d678ffb9c0263b24a97847620c99d213eb1400000000000000000000000000000000000000000000000000000e6e90a06ef200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b81d678ffb9c0263b24a97847620c99d213eb14000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000104414bf3890000000000000000000000007130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c00000000000000000000000055d398326f99059ff775485246999027b31979550000000000000000000000000000000000000000000000000000000000000064000000000000000000000000ea749fd6ba492dbc14c24fe8a3d08769229b896c0000000000000000000000000000000000000000000000000000018f1ece37a200000000000000000000000000000000000000000000000000000e6e90a06ef20000000000000000000000000000000000000000000000000db16a8b90edc1680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000055d398326f99059ff775485246999027b3197955000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000006d8fba276ec6f1eda2344da48565adbca7e4ffa5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000055d398326f99059ff775485246999027b3197955000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000006d8fba276ec6f1eda2344da48565adbca7e4ffa5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000845b41b908000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de017abdb6810f400000000000000000000000000000000000000000000000000000000000efbb700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000055d398326f99059ff775485246999027b3197955000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000004268b8f0b87b6eae5d897996e6b845ddbd99adf3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000ce16f69375520ab01377ce7b88f5ba8c48f8d66600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000004268b8f0b87b6eae5d897996e6b845ddbd99adf30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000761786c55534443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007506f6c79676f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a30786365313646363933373535323061623031333737636537423838663542413843343846384436363600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000094000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000040042bf6f5bf12819e49336ac19bcb982919e6000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000006c000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000750e4c4984a9e0f12978ea6742bc1c5d248f40ed0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000750e4c4984a9e0f12978ea6742bc1c5d248f40ed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000750e4c4984a9e0f12978ea6742bc1c5d248f40ed0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000750e4c4984a9e0f12978ea6742bc1c5d248f40ed0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000064000000000000000000000000ea749fd6ba492dbc14c24fe8a3d08769229b896c00000000000000000000000000000000000000000000000000000000000f36af00000000000000000000000000000000000000000000000000000000000ef5b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000750e4c4984a9e0f12978ea6742bc1c5d248f40ed000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000f5b509bb0909a69b1c207e495f687a596c168e1200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f5b509bb0909a69b1c207e495f687a596c168e12000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e4bc6511880000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c33590000000000000000000000000040042bf6f5bf12819e49336ac19bcb982919e60000000000000000000000000000000000000000000000000000018f1ece37a400000000000000000000000000000000000000000000000000000000000f387a00000000000000000000000000000000000000000000000000000000000ec3c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000004',
            //     from: '0xc919926ceb1da03087Cb02ae9b5AF93DdE1D2334',
            //     to: '0xce16F69375520ab01377ce7B88f5BA8C48F8D666',
            //     value: '0x025b2d12e7cfc0',
            //   },
            // };
            if (executeTransaction) {
              console.log('Execute Tx.....', executeTransaction?.tx);
              dispatch(
                depositAction.setTxToBeExecuted({
                  data: executeTransaction?.tx?.data,
                  to: executeTransaction?.tx?.to,
                  from: executeTransaction?.tx?.from,
                  value: executeTransaction?.tx?.value,
                  gas: executeTransaction?.tx?.gas,
                  chainId: executeTransaction?.fromChain?.chainId,
                }),
              );
              setTxInfo({
                to: approval?.tx[0]?.to,
                data: approval?.tx[0]?.data,
                value: 0,
                chainId: approval?.fromChain?.chainId,
                onSuccess(data) {
                  setReadyToExecute(true);
                },
              });
            }
          }
        }
      } else {
        const sameChainQuotes = await getQuoteFromLifi(
          asset?.contracts_balances[0]?.chainId,
          '137',
          asset?.contracts_balances[0]?.address ===
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : asset?.contracts_balances[0]?.address,
          '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          usdcToTokenValue,
          address,
        );
        if (sameChainQuotes?.data?.transactionRequest) {
          //Same chain Swaps
          const approvalData = createApprovalTransaction(
            sameChainQuotes?.data?.transactionRequest?.to,
            usdcToTokenValue?.toString(),
          );
          console.log(
            'Tx to be approved.....',
            {
              to: '0x0000000000000000000000000000000000000000',
              value: 0,
              chainId: 137,
              data: approvalData,
              onSuccess(data) {
                console.log('Successfull tx!!!!!!!', data);
                setReadyToExecute(true);
              },
            },
            'Tx to be executed.....',
            sameChainQuotes?.data?.transactionRequest,
          );
          dispatch(
            depositAction.setTxToBeExecuted({
              to: sameChainQuotes?.data?.transactionRequest?.to,
              from: sameChainQuotes?.data?.transactionRequest?.from,
              value: 0,
              chainId: 137,
              data: sameChainQuotes?.data?.transactionRequest?.data,
            }),
          );
          setTxInfo({
            to:
              asset?.contracts_balances[0]?.address ===
              '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                ? '0x0000000000000000000000000000000000000000'
                : asset?.contracts_balances[0]?.address,
            value: 0,
            chainId: 137,
            data: approvalData,
            onSuccess(data) {
              console.log('Successfull tx!!!!!!!', data);
              setReadyToExecute(true);
            },
          });
        }
      }
    }
    setAssetLoading(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: isLoading ? '#000' : '#1E1E1EF2'},
          ]}>
          <View
            style={{
              height: 6,
              width: '20%',
              backgroundColor: '#000',
              borderRadius: 12,
              alignSelf: 'center',
              opacity: 0.7,
            }}
          />
          <Text
            style={{
              marginTop: 12,
              marginBottom: 12,
              color: 'white',
              fontFamily: `NeueMontreal-Bold`,
              fontSize: 20,
              lineHeight: 24,
            }}>
            {step === 'wallet' ? `Choose your wallet` : `Choose your asset`}
          </Text>
          {isLoading && (
            <View
              style={{
                justifyContent: 'center',
                height: '80%',
                width: '100%',
                backgroundColor: isLoading ? '#000' : '#fff',
              }}>
              <LottieView
                source={require('../../../assets/lottie/iosLottieLoader.json')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                }}
                autoPlay
                loop
              />
            </View>
          )}
          {!isLoading && step === 'wallet' && (
            <View style={styles.listWrap}>
              <W3mButton />
              {/* {listOfWallet.map((wallets, i) => {
                <Pressable
                  key={i}
                  style={{
                    width: '100%',
                    padding: 12,
                    //   marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={async () =>
                    connectWithSelectedWallet(wallets?.name)
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 40,
                        backgroundColor: '#393939',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={{uri: wallets?.url}}
                        style={{
                          width: 24,
                          height: 24,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: `NeueMontreal-Semibold`,
                        fontSize: 16,
                        lineHeight: 19.2,
                        marginLeft: 8,
                      }}>
                      {wallets?.name}
                    </Text>
                  </View>
                  {walletType === wallets?.name && walletLoading ? (
                    <ActivityIndicator size={16} color="#fff" />
                  ) : null}
                </Pressable>;
              })} */}
            </View>
          )}
          {!isLoading && step === 'asset' && (
            <View style={styles.listWrap}>
              {assets.map((asset, i) => {
                return (
                  <Pressable
                    key={i}
                    style={{
                      width: '100%',
                      padding: 12,
                      //   marginBottom: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={async () => await executeSwapFlow(asset)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '70%',
                      }}>
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 40,
                          backgroundColor: '#393939',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{uri: asset?.asset?.logo}}
                          style={{
                            width: 24,
                            height: 24,
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}
                        />
                      </View>
                      <View>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: 'white',
                            fontFamily: `NeueMontreal-SemiBold`,
                            fontSize: 16,
                            lineHeight: 19.2,
                            marginLeft: 8,
                            maxWidth: '100%',
                          }}>
                          {asset?.asset?.name}
                        </Text>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: `NeueMontreal-Medium`,
                            fontSize: 16,
                            lineHeight: 19.2,
                            marginLeft: 8,
                            maxWidth: '100%',
                          }}>
                          {asset?.token_balance}
                          {asset?.asset?.symbol}
                        </Text>
                      </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: `NeueMontreal-Medium`,
                          fontSize: 16,
                          lineHeight: 19.2,
                          marginLeft: 8,
                        }}>
                        $ {asset?.estimated_balance?.toFixed(2)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal at the bottom
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    // height: '90%', // Make modal take full width at the bottom
    backgroundColor: '#fff',
    borderTopRightRadius: 16, // Only round the top corners
    borderTopLeftRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listWrap: {
    // flexDirection: 'row', // Align items in a row
    // flexWrap: 'wrap', // Allow items to wrap to the next line
    // justifyContent: 'center', // Align items to the start of the container
    // padding: 8, // Add some padding around the container
    marginTop: '4%',
  },
});

export default CrossChainModal;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useWeb3Modal} from '@web3modal/wagmi-react-native';
import erc20 from '../../screens/loggedIn/payments/USDC.json';
import LinearGradient from 'react-native-linear-gradient';
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
import {useNavigation} from '@react-navigation/native';
import {depositAction} from '../../store/reducers/deposit';
import Toast from 'react-native-root-toast';
import {disconnect} from '@wagmi/core';
const CrossChainModal = ({modalVisible, setModalVisible, value}) => {
  // renders
  const {address} = useAccount();
  const {open, close} = useWeb3Modal();
  const [txInfo, setTxInfo] = useState({});
  const {config} = usePrepareSendTransaction(txInfo);
  const {
    data: sendTxData,
    isLoading: sendTransactionLoading,
    isSuccess,
    sendTransactionAsync,
    isError: txError,
  } = useSendTransaction(config);
  const {data: transactionData, isError} = useWaitForTransaction(sendTxData);
  const [assets, setAssets] = useState([]);
  const [executionStages, setExecutionStages] = useState(
    'Polling Tx information',
  );
  const [assetLoading, setAssetLoading] = useState(false);
  const [step, setStep] = useState('wallet');
  const [readyToExecute, setReadyToExecute] = useState(false);
  const [assetType, setAssetType] = useState(false);
  const nextTxToBeExecuted = useSelector(x => x.deposit.txToBeExecuted);
  const isLoading = useSelector(x => x.deposit.txLoading);
  const dispatch = useDispatch();
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const navigation = useNavigation();
  const createApprovalTransaction = (to, amount) => {
    const erc20Abi = new ethers.Interface(erc20);
    const approveData = erc20Abi.encodeFunctionData('approve', [to, amount]);
    return approveData;
  };
  const createSendTransaction = (to, amount) => {
    const erc20Abi = new ethers.Interface(erc20);
    const approveData = erc20Abi.encodeFunctionData('transfer', [to, amount]);
    return approveData;
  };
  useEffect(() => {
    const executeTx = async () => {
      if (readyToExecute) {
        try {
          await sendTransactionAsync?.();
          setReadyToExecute(false);
        } catch (error) {
          console.log(error);
          dispatch(depositAction.setTxLoading(false));
        }
      }
    };
    executeTx();
  }, [readyToExecute]);

  useEffect(() => {
    const executeTx = async () => {
      if (isError || txError) {
        dispatch(depositAction.setTxLoading(false));
      }
    };
    executeTx();
  }, [isError, txError]);

  useEffect(() => {
    setExecutionStages('Polling Tx information');
    if (transactionData?.status === 'success') {
      if (!nextTxToBeExecuted) {
        setExecutionStages('Tx successful');
        dispatch(depositAction.setTxLoading(false));
        navigation.navigate('Portfolio');
      } else {
        setExecutionStages('Execute Swap');
        setTxInfo({
          ...nextTxToBeExecuted,
          onSuccess(data) {
            setReadyToExecute(true);
          },
        });
        dispatch(depositAction.setTxToBeExecuted(false));
      }
    } else {
      setExecutionStages('Tx reverted');
      dispatch(depositAction.setTxLoading(false));
    }
  }, [transactionData]);

  useEffect(() => {
    if (sendTxData?.hash) {
      setExecutionStages('Tx successfully sent');
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
    if (asset?.estimated_balance > value) {
      setAssetType(asset?.asset?.name);
      setAssetLoading(true);
      dispatch(depositAction.setTxLoading(true));
      setExecutionStages('Converting USDC value');
      let usdcToTokenValue =
        (1 / asset?.price)?.toFixed(asset?.contracts_balances[0]?.decimals) *
        Math.pow(10, asset?.contracts_balances[0]?.decimals) *
        value;
      if (asset?.contracts_balances[0]?.chainId !== '137') {
        setExecutionStages('Getting Quotes');
        const chain = await getAllSupportedChainsFromSwing();
        const destinationChain = chain.filter(
          x => x?.id === asset?.contracts_balances[0]?.chainId,
        );
        try {
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
          setExecutionStages('Filtering Best Quotes');
          let bestQuoteTokenOutRoute = quote.routes?.map(x =>
            parseInt(x?.quote?.amount),
          );
          bestQuoteTokenOutRoute = Math.max(...bestQuoteTokenOutRoute);
          bestQuoteTokenOutRoute = quote.routes.filter(
            x => parseInt(x?.quote?.amount) === bestQuoteTokenOutRoute,
          );
          if (
            asset?.contracts_balances[0]?.address ===
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ) {
            setExecutionStages('Execute Swap');
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
            console.log('execute..........', executeTransaction?.tx?.data);
            if (executeTransaction?.tx?.data) {
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
              dispatch(depositAction.setTxLoading(false));
            }
          } else {
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
              console.log('execute..........', executeTransaction?.tx?.data);
              if (executeTransaction?.tx?.data) {
                setExecutionStages('Execute Approval');
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
                  from: address,
                  to: approval?.tx[0]?.to,
                  data: approval?.tx[0]?.data,
                  value: 0,
                  chainId: approval?.fromChain?.chainId,
                  onSuccess(data) {
                    setReadyToExecute(true);
                  },
                });
              } else {
                dispatch(depositAction.setTxLoading(false));
                Toast.show('Tx may fail, retry is sometime', {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                });
              }
            }
          }
        } catch (error) {
          dispatch(depositAction.setTxLoading(false));
          Toast.show('Tx may fail, retry is sometime', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      } else {
        if (
          asset?.contracts_balances[0]?.address ===
          '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'
        ) {
          const transferData = createSendTransaction(
            evmInfo?.smartAccount,
            value,
          );
          setTxInfo({
            from: address,
            to: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            value: 0,
            chainId: 137,
            data: transferData,
            onSuccess(data) {
              setReadyToExecute(true);
            },
          });
        } else {
          try {
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
                from: address,
                chainId: 137,
                data: approvalData,
                onSuccess(data) {
                  console.log('Successfull tx!!!!!!!', data);
                  setReadyToExecute(true);
                },
              });
            } else {
              dispatch(depositAction.setTxLoading(false));
              Toast.show('Something went wrong', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            }
          } catch (error) {
            dispatch(depositAction.setTxLoading(false));
            Toast.show('Something went wrong', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          }
        }
      }
    } else {
      dispatch(depositAction.setTxLoading(false));
      Toast.show('Not enough balance', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
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
            {backgroundColor: isLoading ? '#000' : '#000'},
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                marginTop: 12,
                marginBottom: 12,
                color: 'white',
                fontFamily: `NeueMontreal-Bold`,
                fontSize: 20,
                lineHeight: 24,
              }}>
              {!isLoading && step !== 'wallet'
                ? step === 'wallet'
                  ? `Choose your wallet`
                  : `Choose your asset`
                : null}
            </Text>
            {address && !isLoading && (
              <Text
                style={{
                  marginTop: 12,
                  marginBottom: 12,
                  color: 'white',
                  fontFamily: `NeueMontreal-Medium`,
                  fontSize: 16,
                  lineHeight: 24,
                }}
                onPress={async () => {
                  await disconnect();
                  setStep('wallet');
                  setAssets([]);
                }}>
                disconnect
              </Text>
            )}
          </View>
          {isLoading && (
            <View
              style={{
                justifyContent: 'center',
                height: '20%',
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
              <Text
                style={{
                  color: 'white',
                  fontFamily: `NeueMontreal-Medium`,
                  fontSize: 20,
                  lineHeight: 24,
                  alignSelf: 'center',
                  marginTop: 12,
                }}>
                {executionStages}
              </Text>
            </View>
          )}
          {!isLoading && step === 'wallet' && (
            <View style={styles.listWrap}>
              {/* <W3mButton
                size="md"
                label="Connect your wallet"
                connectStyle={{
                  backgroundColor: 'black',
                  width: '100%',
                  color: 'black',
                }}
              /> */}
              <TouchableOpacity
                style={{
                  height: 45,
                  width: '100%',
                  borderRadius: 30,
                  marginBottom: 16,
                }}
                onPress={async () => {
                  navigation.push('QRScreen');
                  setModalVisible(false);
                }} // Open modal on press
              >
                <LinearGradient
                  useAngle={true}
                  angle={150}
                  colors={['#fff', '#fff']}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 14,
                      fontFamily: 'NeueMontreal-Medium',
                    }}>
                    Send via QR Code
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 45,
                  width: '100%',
                  borderRadius: 30,
                  marginBottom: 16,
                }}
                onPress={async () => {
                  open();
                }}>
                <LinearGradient
                  useAngle={true}
                  angle={150}
                  colors={['#000', '#000']}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'NeueMontreal-Medium',
                    }}>
                    Connect your wallet
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
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
    backgroundColor: 'black',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CrossChainModal;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const Ramper = ({ navigation }) => {
    const UNIRAMP_API_BASE_URL = 'https://api.uniramp.io/v1/onramp';
    // Directly defining the API key here for demonstration, replace 'YOUR_API_KEY' with your actual Uniramp API key
    const unirampKey = 'pk_prod_eb0suFktOsnpthQYX5LXoMXIychV7Ofv'; // <-- Direct definition (use your actual key here)
    const [value, setValue] = useState("1");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const handlePress = () => {
        if (selectedId === "wallet") {
            setModalVisible(true);
        }
        // Additional actions based on other selectedId values or conditions
    };
    useEffect(() => {
        fetchPublicIPv4Address().then(ipAddress => {
            fetchPaymentMethodsBasedOnIP(ipAddress);
        });
    }, []);

    const fetchPublicIPv4Address = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            console.log("Public IPv4 Address:", data.ip);
            return data.ip;
        } catch (error) {
            console.error('Error fetching public IPv4 address:', error);
        }
    };
    let globalPaymentMethods = []; // This will store the payment methods accessible globally

    const fetchPaymentMethodsBasedOnIP = async (ipAddress) => {
        const params = new URLSearchParams({ address: ipAddress });
        const url = new URL(`${UNIRAMP_API_BASE_URL}/supported/ip`);
        url.search = params.toString();

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-api-key': unirampKey,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const fetchedPaymentMethods = data.payment || []; // Default to an empty array if undefined

            // Optionally, add a custom payment method
            fetchedPaymentMethods.push({
                "id": "wallet",
                "name": "Wallet",
                "image": "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png" // Ensure you have permission to use this image
            });

            setPaymentMethods(fetchedPaymentMethods);
        } catch (error) {
            console.error('There was an error fetching payment methods:', error);
        }
    };

    useEffect(() => {
        fetchPublicIPv4Address().then(ipAddress => {
            if (ipAddress) {
                fetchPaymentMethodsBasedOnIP(ipAddress);
            }
        });
    }, []);

    const renderPaymentMethod = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedId(item.id)}
            style={[
                styles.button,
                { borderColor: item.id === selectedId ? 'purple' : 'transparent' },
            ]}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );
    return (
        <LinearGradient colors={['#9753F5', '#3C0A65', '#000', '#000', '#000', '#000', '#000']} start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Use a wrapper View with flex: 1 to fill available space and push the footer to the bottom */}
                <View style={{ flex: 1 }}>
                    {/* Header and content here */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginBottom: '10%', marginTop: '5%' }}>
                        <Icon
                            name={'navigate-before'}
                            size={30}
                            color={'#f0f0f0'}
                            type="materialicons"
                            onPress={() => navigation.goBack()}
                            style={{ marginLeft: 120 }}
                        />
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 30 }}>
                            <Text style={{
                                color: '#F0F0F0',
                                fontFamily: 'Satoshi-Black',
                                fontSize: 16,
                            }}>Deposit Funds</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 80, flexDirection: "row", justifyContent: "center", gap: 8 }}>
                        <Text style={{ fontSize: 80, fontWeight: "900", color: "#AF6AE9", textAlign: "center", marginTop: 10, fontFamily: 'Unbounded-ExtraBold' }}>$</Text>
                        <TextInput
                            style={{ fontSize: 80, fontWeight: "900", color: "#AF6AE9", textAlign: "center", fontFamily: "Unbounded-ExtraBold", }}
                            value={value}
                            onChangeText={(text) => {
                                setValue(text)
                            }}
                            keyboardType='numeric'

                        />
                    </View>
                    <View style={{ marginTop: '2%', flexDirection: "row", justifyContent: "center", gap: 8 }}>
                        <TouchableOpacity style={styles.button}>
                            <View style={styles.imagePlaceholder}>
                                <Image
                                    source={{ uri: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png' }}
                                    style={{ width: 24, height: 24, borderRadius: 12 }} // Make image rounded
                                />
                            </View>
                            <Text style={styles.text}>USDC</Text>
                            <Icon
                                name={'expand-more'}
                                size={16}
                                color={'#f0f0f0'}
                                type="materialicons"
                                onPress={() => navigation.goBack()}
                                style={{ marginLeft: 120 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: '9%' }}>
                        <Text style={{ fontSize: 16, color: "#7e7e7e", textAlign: "center", fontFamily: 'Satoshi-Medium' }}>Choose your preffered deposit method</Text>
                        <Text style={{ fontSize: 16, color: "#fff", textAlign: "center", fontFamily: 'Satoshi-Bold' }}>to enter a new era of finance</Text>
                    </View>
                    <View style={styles.wrapContainer}>
                        {paymentMethods.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedId(item.id)}
                                style={[
                                    styles.button,
                                    { borderColor: item.id === selectedId ? '#A66CFF' : 'transparent' },
                                    { color: item.id === selectedId ? '#A66CFF' : 'transparent' },
                                ]}
                            >
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <Text style={{ color: item.id === selectedId ? '#FFF' : '#8D8D8D', fontFamily: 'Satoshi-Regular' }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Footer: Trade button sticky at the bottom */}
                <View
                    style={{
                        height: 50,
                        marginHorizontal: '5%',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        borderRadius: 6,
                        marginBottom: '5%', // Adjust this for spacing from the bottom edge
                    }}>
                    <TouchableOpacity
                        style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 30,
                        }}>
                        <LinearGradient
                            useAngle={true}
                            angle={150}
                            colors={['#BC88FF', '#BC88FF']}
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
                                    fontFamily: 'Unbounded-ExtraBold',
                                }}>
                                CONTINUE
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};
const styles = StyleSheet.create({
    // button: {
    //     flexDirection: 'row', // Align items in a row
    //     width: 100,
    //     height: 35,
    //     borderRadius: 100,
    //     backgroundColor: '#1D1D1D', // Add your desired background color
    //     justifyContent: 'center', // Center items horizontally
    //     alignItems: 'center', // Center items vertically
    //     paddingHorizontal: 10, // Add some padding if needed
    // },
    imagePlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12, // Half of width/height to make it a circle
        backgroundColor: '#fff', // Placeholder color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5, // Add some margin to the right of the circle
    },
    text: {
        color: '#fff', // Text color
        fontSize: 14,
        fontFamily: 'Satoshi-Black', // Make sure you have this font loaded
    },
    wrapContainer: {
        flexDirection: 'row', // Align items in a row
        flexWrap: 'wrap', // Allow items to wrap to the next line
        justifyContent: 'center', // Align items to the start of the container
        padding: 8, // Add some padding around the container
        marginTop: '10%'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1d1d1d',
        borderWidth: 2,
        borderRadius: 100,
        height: 36,
        paddingHorizontal: 10,
        justifyContent: 'center',
        margin: 1.5, // Space around each button
    },
    image: {
        backgroundColor: '#fff',
        width: 26,
        height: 26,
        borderRadius: 13, // Make the image round
        marginRight: 10,
    },
});

export default Ramper;

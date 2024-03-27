import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');
import Clipboard from '@react-native-clipboard/clipboard';
import FastImage from 'react-native-fast-image';

class LoginCarousel extends React.Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.props.images.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            x: width * this.state.selectedIndex,
            y: 0,
          });
        },
      );
    }, 3000);
  };

  setSelectedIndex = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
    this.setState({selectedIndex});
  };

  render(navigation) {
    const {images} = this.props;
    const {selectedIndex} = this.state;
    return (
      <ScrollView horizontal pagingEnabled ref={this.scrollRef}>
        {images.map(image => (
          <View style={styles.depWith} key={image.name}>
            <Text style={styles.xade}>XADE</Text>
            <Text style={styles.header}>{image.name}</Text>
            <Text style={styles.subheader}>{image.details}</Text>
            <FastImage
              source={{
                uri: image.image,
              }}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 300,
                borderRadius: 50,
              }}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  depWith: {
    flexDirection: 'column',
    width: width,
    height: height,
    alignItems: 'center',
  },

  header: {
    color: '#fff',
    fontFamily: `Unbounded-Bold`,
    textAlign: 'center',
    fontSize: 32,
    marginTop: '2%',
  },
  xade: {
    color: '#fff',
    fontFamily: `LemonMilk-Bold`,
    textAlign: 'center',
    fontSize: 28,
    marginTop: '12%',
  },

  subheader: {
    color: '#817C89',
    fontFamily: `NeueMontreal-Medium`,
    textAlign: 'center',
    fontSize: 20,
    marginTop: '4%',
    marginBottom: '10%',
  },
});

export {LoginCarousel};

import {StyleSheet, Dimensions, Platform} from 'react-native';
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  topbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#0C0C0C',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  logo: {
    fontFamily: 'NeueMontreal-Bold',
    color: '#fff',
    fontSize: 25,
    marginLeft: '8%',
    marginTop: '2%',
    marginBottom: '2%',
  },

  net: {
    marginLeft: '8%',
    textAlign: 'center',
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#181B31',
    borderRadius: 35,
    marginRight: '5%',
  },

  nameSettings: {
    width: '90%',
    marginTop: '5%',
    backgroundColor: 'transparent',
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },

  otherSettings: {
    width: '90%',
    marginTop: width * 0.05,
    flexDirection: 'column',
    backgroundColor: '#101010',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 10,
    // justifyContent: 'space-between',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },

  innerSettings: {
    paddingLeft: 10,

    paddingBottom: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  actualSetting: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: '3%',
  },
  settingsText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'NeueMontreal-Bold',
    alignSelf: 'center',
  },

  events: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '5%',
    width: '100%',
  },

  switch: {
    width: '60%',
    paddingVertical: 20,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 100,
  },

  switchText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: ``,
    fontSize: 15,
  },

  logout: {
    width: '90%',
    marginTop: '5%',
    marginBottom: '15%',
    paddingVertical: 10,
    backgroundColor: '#101010',
    borderRadius: 10,
  },

  logoutText: {
    textAlign: 'center',
    color: '#E14C4C',
    fontFamily: ``,
    fontSize: 20,
  },

  socialMedia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
    alignSelf: 'center',
  },

  innerMedia: {
    marginHorizontal: '4%',
  },
});

export default styles;

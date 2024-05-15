import {useState} from 'react';
import {StyleSheet, View, Text, Image, TextInput} from 'react-native';

const AuthTextInput = ({placeholder, width, value, onChange, isPassword}) => {
  const [onFocus, setOnFocus] = useState(false);
  return (
    <View
      style={[
        styles.inputWrapper,
        {borderWidth: 1, borderColor: onFocus ? 'white' : '#1C1C1C'},
        {width},
      ]}>
      <Text style={styles.inputWrapperLabelText}>
        {value?.length > 0 ? placeholder : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={x => onChange(x)}
        onFocus={() => setOnFocus(true)}
        onBlur={() => setOnFocus(false)}
        style={[styles.input]}
        placeholder={placeholder}
        placeholderTextColor={'#8B8B8B'}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    height: 59,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputWrapperLabelText: {
    // font-family: Sk-Modernist;
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14.4,
    color: '#8B8B8B',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 16,
    alignSelf: 'flex-end',
    // font-family: Sk-Modernist;
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19.2,
    color: '#FFFFFF',
    // text-align: left;
  },
});

export default AuthTextInput;

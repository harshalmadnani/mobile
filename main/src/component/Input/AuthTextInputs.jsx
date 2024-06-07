import React, {Component, useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, Text, Image, TextInput} from 'react-native';

const AuthTextInput = React.memo(
  ({placeholder, width, value, onChange, isPassword, backgroundColor}) => {
    const [onFocus, setOnFocus] = useState(false);

    const handleChange = useCallback(
      text => {
        if (placeholder.toLowerCase() === 'email') {
          onChange(text.toLowerCase());
        } else {
          onChange(text);
        }
      },
      [onChange, placeholder],
    );

    return (
      <View
        style={[
          styles.inputWrapper,
          {
            borderWidth: 1,
            borderColor: onFocus ? 'white' : '#1C1C1C',
            backgroundColor: backgroundColor || '#1C1C1C',
          },
          {width},
        ]}>
        <Text style={styles.inputWrapperLabelText}>
          {value?.length > 0 ? placeholder : ''}
        </Text>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
          style={[styles.input]}
          placeholder={placeholder}
          placeholderTextColor={'#8B8B8B'}
          secureTextEntry={isPassword}
        />
      </View>
    );
  },
);

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
  },
  input: {
    width: '100%',
    alignSelf: 'flex-end',
    fontFamily: 'NeueMontreal-Medium',
    fontSize: 16,
    lineHeight: 19.2,
    color: '#FFFFFF',
    // text-align: left;
  },
});

export default React.memo(AuthTextInput);

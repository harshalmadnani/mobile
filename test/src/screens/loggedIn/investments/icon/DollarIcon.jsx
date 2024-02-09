import React from 'react';
import Svg, { Defs, Path, LinearGradient, Stop } from "react-native-svg";

const DollarIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984" stroke="url(#paint0_linear_1603_179)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 6V18" stroke="url(#paint1_linear_1603_179)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#paint2_linear_1603_179)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Defs>
      <LinearGradient id="paint0_linear_1603_179" x1="12.0069" y1="7.33984" x2="12.0069" y2="16.6598" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#C397FF"/>
        <Stop offset="1" stopColor="#82FFC3"/>
      </LinearGradient>
      <LinearGradient id="paint1_linear_1603_179" x1="12.5" y1="6" x2="12.5" y2="18" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#C397FF"/>
        <Stop offset="1" stopColor="#82FFC3"/>
      </LinearGradient>
      <LinearGradient id="paint2_linear_1603_179" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#C397FF"/>
        <Stop offset="1" stopColor="#82FFC3"/>
      </LinearGradient>
    </Defs>
  </Svg>
);

export default DollarIcon;

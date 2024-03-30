import React from 'react';
import {View} from 'react-native';
import {Skeleton} from '@rneui/themed';
const CustomSkeleton = ({element, width, height}) => {
  let sampleArray = new Array(element).fill(1);

  return (
    <View
      style={{width: '100%', backgroundColor: 'black', alignItems: 'center'}}>
      {sampleArray.map((x, i) => (
        <Skeleton
          key={i}
          animation="pulse"
          skeletonStyle={{
            marginVertical: 8,
            borderRadius: 12,
          }}
          style={{backgroundColor: 'black', borderRadius: 12, opacity: 0.5}}
          width={width}
          height={height}
        />
      ))}
    </View>
  );
};
export default CustomSkeleton;

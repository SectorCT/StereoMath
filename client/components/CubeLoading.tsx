import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';


const CubeLoading = ({ size = 100 }) => {
    const AnimatedPath = Animated.createAnimatedComponent( Path );
  const pathProgress = useSharedValue(0);
  const scale = size / 100; // Base size is 100x100, scale according to the size prop
  const strokeWidth = scale * 2; // Adjust stroke width based on scale

  // Define the adjusted SVG path
  const cubePath = `M ${70 * scale} ${10 * scale} L ${30 * scale} ${10 * scale} L ${30 * scale} ${50 * scale} L ${70 * scale} ${50 * scale} Z M ${70 * scale} ${10 * scale} L ${50 * scale} ${30 * scale} M ${30 * scale} ${10 * scale} L ${10 * scale} ${30 * scale} M ${30 * scale} ${50 * scale} L ${10 * scale} ${70 * scale} M ${70 * scale} ${50 * scale} L ${50 * scale} ${70 * scale} M ${50 * scale} ${30 * scale} L ${10 * scale} ${30 * scale} L ${10 * scale} ${70 * scale} L ${50 * scale} ${70 * scale} Z`;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 400 * scale * (1 - pathProgress.value),
  }));

  React.useEffect(() => {
    const startAnimation = () => {
      pathProgress.value = withTiming(0.45, {
        duration: 3000,
        easing: Easing.inOut(Easing.linear)
      }, (isFinished) => {
        if (isFinished) {
          pathProgress.value = 0;
          runOnJS(startAnimation)();
        }
      });
    };

    startAnimation();
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${80 * scale} ${70 * scale}`}>
        <AnimatedPath
          d={cubePath}
          fill="none"
          stroke="#171717"
          strokeWidth={strokeWidth}
          strokeDasharray={400 * scale}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});

export default CubeLoading;
import React, { useState, useRef, useEffect} from 'react';
import { View, PanResponder, StyleSheet, Dimensions } from 'react-native';


const topOffset = 150;

export default function ResizableCenteredView({onResize} : {
	onResize:(dimensions: { width: number; height: number }, position: { top: number; left: number }) => void
}) {
	const initialWidth = 100;
	const initialHeight = 100;

	const maxWidth = 300;
	const maxHeight = 400;

	const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
	const [position, setPosition] = useState({ top: -Dimensions.get("window").height/2 + initialHeight/2 - topOffset, left: Dimensions.get("screen").width/2 - initialWidth / 2 });

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gestureState) => {

				const newWidth = Math.min(maxWidth, Math.max(initialWidth, Math.abs(gestureState.dx) * 2));
				const newHeight = Math.min(maxHeight, Math.max(initialHeight, Math.abs(gestureState.dy) * 2));

				setPosition({ top: -Dimensions.get("window").height/2 + newHeight/2 - topOffset, left: Dimensions.get("screen").width/2 - newWidth / 2 })

				setDimensions({
					width: newWidth,
					height: newHeight
				});
			}
		})
	).current;

	useEffect(() => {
        onResize(dimensions, position);
    }, [dimensions, position]);


	return (
		<View style={styles.container}>
			<View
				style={[styles.resizableBox, {
					width: dimensions.width,
					height: dimensions.height,
					top: position.top,
					left: position.left
				}]}
				{...panResponder.panHandlers}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "absolute",
	},
	resizableBox: {
		backgroundColor: '#00000000',
		borderColor: "#000000",
		borderWidth: 5,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
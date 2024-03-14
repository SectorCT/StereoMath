import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CameraPage from "./pages/CameraPage";
import GraphicScreen from "./pages/GraphicScreen";
import TextInputPage from "./pages/TextInputPage";

export type HomeStackParamList = {
	CameraPage: undefined;
	GraphicScreen: {
		friendshipId: string;
		friendName: string;
	};
    TextInputPage: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export default function HomeStackContainer() {
	return (
		
		<HomeStack.Navigator>
			<HomeStack.Screen name="CameraPage" component={CameraPage} options={{ headerShown: false }} />
            <HomeStack.Screen name="GraphicScreen" component={GraphicScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="TextInputPage" component={TextInputPage} options={{ headerShown: false }} />
		</HomeStack.Navigator>
	);
}
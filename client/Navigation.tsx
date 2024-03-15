import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CameraPage from "./pages/CameraPage";
import GraphicScreen from "./pages/GraphicScreen";
import TextInputPage from "./pages/TextInputPage";
import { View, Text } from "react-native";

import { figureData } from "./Types";

export type NavStackParamList = {
	GraphicScreen: {
		problem: string;
	};
	CameraPage: undefined;
    TextInputPage: undefined;
};

const NavStack = createStackNavigator<NavStackParamList>();

export default function NavStackContainer() {
	return (
		<NavStack.Navigator>
			<NavStack.Screen name="GraphicScreen" component={GraphicScreen} options={{ headerShown: false }} />
			<NavStack.Screen name="CameraPage" component={CameraPage} options={{ headerShown: false }} />
            <NavStack.Screen name="TextInputPage" component={TextInputPage} options={{ headerShown: false }} />
		</NavStack.Navigator>
	);
}
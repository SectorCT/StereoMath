import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CameraPage from "../pages/MainPage";
import GraphicScreen from "../pages/graphicScreen/GraphicScreen";
import TextInputPage from "../pages/TextInputPage";
import History from "../pages/History";

import { figureData } from "../Types";

export type NavStackParamList = {
	GraphicScreen: {
		problem: string;
		data?: figureData;
	};
	CameraPage: undefined;
    TextInputPage: {
		problem: string | null | undefined;
	};
	History: undefined;
};

const NavStack = createStackNavigator<NavStackParamList>();

export default function NavStackContainer() {
	return (
		<NavStack.Navigator>
			<NavStack.Screen name="CameraPage" component={CameraPage} options={{ headerShown: false }} />
            <NavStack.Screen name="TextInputPage" component={TextInputPage} options={{ headerShown: false }} />
			<NavStack.Screen name="GraphicScreen" component={GraphicScreen} options={{ headerShown: false }} />
			<NavStack.Screen name="History" component={History} options={{ headerShown: false }} />
		</NavStack.Navigator>
	);
}
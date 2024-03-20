import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";

export default function HamburgerMenu() {
  const [burgerClass, setBurgerClass] = useState("burger-bar unclicked");
  const [menuClass, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const handleMenuClick = () => {
    if (isMenuClicked) {
      setBurgerClass("burger-bar clicked");
      setMenuClass("menu visible");
    } else {
      setBurgerClass("burger-bar unclicked");
      setMenuClass("menu hidden");
    }
    setIsMenuClicked(!isMenuClicked);
  };

  return (
    <Button
      text=""
      onPress={handleMenuClick}
      size={24}
      icon="menu"
      color="black"
    />
  );
}

const styles = StyleSheet.create({
  menu: {
    width: "40%",
    height: "100%",
    backgroundColor: "lightblue",
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  hidden: {
    display: "none",
  },
  visible: {
    display: "flex",
  },
});

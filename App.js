import { StatusBar } from "expo-status-bar";
import { View, Pressable } from "react-native";
import TodoList from "./components/TodoList";
import { RootSiblingParent } from "react-native-root-siblings";
import EStyleSheet from "react-native-extended-stylesheet";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";

// themes
import lightTheme from "./light";
import darkTheme from "./dark";

// initially use light theme
EStyleSheet.build(lightTheme);

export default function App() {
  const [update, forceUpdate] = useState(true);

  const toggleTheme = () => {
    const theme =
      EStyleSheet.value("$theme") === "light" ? darkTheme : lightTheme;
    EStyleSheet.build(theme);
    forceUpdate(!update);
  };

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <TodoList />
        <StatusBar style="auto" />
        <Pressable
          style={[styles.pressable, styles.fixedTopRight]}
          onPress={toggleTheme}
        >
          <Entypo name="light-up" size={24} style={styles.color} />
        </Pressable>
      </View>
    </RootSiblingParent>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "$bgColor",
  },
  color: {
    color: "$textColor",
  },
  pressable: {
    borderWidth: 1,
    margin: 8,
    padding: 8,
    borderColor: "$textColor",
  },
  fixedTopRight: {
    position: "absolute",
    top: 40,
    right: 8,
  },
});

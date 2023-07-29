import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import TodoList from "./components/TodoList";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <TodoList />
        <StatusBar style="auto" />
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

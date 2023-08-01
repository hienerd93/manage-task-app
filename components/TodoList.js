import { Pressable, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import Toast from "react-native-root-toast";
import EStyleSheet from "react-native-extended-stylesheet";
import { Picker } from "@react-native-picker/picker";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

const QUOTES = [
  "nullius in verba - Royal Society's motto",
  "veni, vidi, vici - Caesar",
  "je pense, donc je suis - Descartes",
  "Gott ist tot - Nietzsche",
];

const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("uncompleted");
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todos = await AsyncStorage.getItem("my-todo");
        if (todos !== null) {
          setTasks(JSON.parse(todos));
        }
      } catch (error) {
        console.log("Error fetching todos:", error);
      }
    };

    fetchData();
  }, []);

  const postData = async (updatedTasks, message) => {
    try {
      setTasks(updatedTasks);
      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTasks));

      if (message) {
        Toast.show(message, {
          duration: Toast.durations.SHORT,
        });
      }
    } catch (error) {
      console.log("Error change task:", error);
      Toast.show("Error change task", { duration: Toast.durations.SHORT });
    }
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSubmitText = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    const addedTask = {
      title: inputValue,
      completed: false,
      id: editTaskId || new Date().getTime().toString(),
    };

    const updatedTasks = editTaskId
      ? tasks.map((task) => (task.id === editTaskId ? addedTask : task))
      : [...tasks, addedTask];

    postData(updatedTasks, `${editTaskId ? "add" : "update"} task success`);
    setInputValue("");
    if (editTaskId) {
      setEditTaskId(null);
    }
  };

  const handleTaskCheckboxChange = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    postData(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    postData(updatedTasks, "Task deleted successfully");
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  const handleCompleteAll = () => {
    const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
    postData(updatedTasks);
  };

  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    postData(updatedTasks);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return task.completed === true;
    } else if (filter === "uncompleted") {
      return task.completed === false;
    }
    return true;
  });

  return (
    <View style={[styles.container, styles.minHeight, styles.padding]}>
      <View style={[styles.section, styles.flexColumn]}>
        <Text style={styles.paragraph}>Todo List</Text>
        <Text style={styles.color}>{quote}</Text>
      </View>
      <View style={styles.section}>
        <TextInput
          style={[styles.container, styles.lgText]}
          placeholder="Add your todo"
          value={inputValue}
          onChangeText={(text) => handleInputChange(text)}
          placeholderTextColor={styles.color.color}
        />
        <Pressable style={styles.pressable} onPress={() => handleSubmitText()}>
          <Text style={styles.lgText}>{editTaskId ? "Update" : "Add"}</Text>
        </Pressable>
      </View>
      <View style={styles.section}>
        <Pressable style={styles.pressable} onPress={() => handleCompleteAll()}>
          <Text style={styles.color}>Complete all tasks</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => handleClearCompleted()}
        >
          <Text style={styles.color}>Delete comp tasks</Text>
        </Pressable>
      </View>
      <View style={[styles.section, styles.container, styles.alignItemsStart]}>
        <FlashList
          data={filteredTasks}
          estimatedItemSize={20}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={item.completed}
                onValueChange={() => handleTaskCheckboxChange(item.id)}
              />
              <Text style={[styles.paragraph, styles.container]}>
                {item.title}
              </Text>
              <View style={styles.section}>
                <Pressable onPress={() => handleEditTask(item.id)}>
                  <Feather name="edit" size={24} style={styles.color} />
                </Pressable>
                <Pressable onPress={() => handleDeleteTask(item.id)}>
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    style={styles.color}
                  />
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
      <View style={[styles.section, styles.justifyContentBetween]}>
        <View>
          <Picker
            style={[styles.picker, styles.color]}
            selectedValue={filter}
            onValueChange={(itemValue) => handleFilterChange(itemValue)}
            dropdownIconColor={styles.color.color}
          >
            <Picker.Item label="all" value="all" />
            <Picker.Item label="uncompleted" value="uncompleted" />
            <Picker.Item label="completed" value="completed" />
          </Picker>
        </View>
        <View>
          <Text style={styles.color}>
            Completed: {tasks.filter((task) => task.completed).length}
          </Text>
        </View>
        <View>
          <Text style={styles.color}>Total Tasks: {tasks.length}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  fullHeight: {
    minHeight: "100%",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flexColumn: {
    flexDirection: "column",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  alignItemsStart: {
    alignItems: "flex-start",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "$textColor",
  },
  checkbox: {
    margin: 8,
  },
  padding: {
    padding: 8,
  },
  pressable: {
    borderWidth: 1,
    margin: 8,
    padding: 8,
    borderColor: "$textColor",
  },
  lgText: {
    fontSize: 24,
    color: "$textColor",
  },
  color: {
    color: "$textColor",
  },
  picker: {
    width: 150,
  },
});

export default TodoList;

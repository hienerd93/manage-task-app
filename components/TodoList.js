import { Pressable, Text, TextInput, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import Toast from "react-native-root-toast";
import EStyleSheet from "react-native-extended-stylesheet";
import { Picker } from "@react-native-picker/picker";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("my-todo");
        if (todos !== null) {
          setTasks(JSON.parse(todos));
        }
      } catch (error) {
        console.log("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

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

    try {
      setTasks(updatedTasks);
      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTasks));
      setInputValue("");
      Toast.show("Task added successfully", {
        duration: Toast.durations.SHORT,
      });
    } catch (error) {
      console.log("Error adding task:", error);
      Toast.show("Error adding task", { duration: Toast.durations.SHORT });
    }
  };

  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    Toast.show("Task deleted successfully", {
      duration: Toast.durations.SHORT,
    });
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
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
      <View style={styles.section}>
        <Text style={styles.paragraph}>Todo List</Text>
      </View>
      <View style={[styles.section]}>
        <TextInput
          style={[styles.container, styles.lgText]}
          placeholder="Add your todo"
          autoFocus
          value={inputValue}
          onChangeText={(text) => handleInputChange(text)}
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
        <FlatList
          data={filteredTasks}
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
        <Picker
          selectedValue={filter}
          onValueChange={(itemValue) => handleFilterChange(itemValue)}
        >
          <Picker.Item label="all" value="all" />
          <Picker.Item label="uncompleted" value="uncompleted" />
          <Picker.Item label="completed" value="completed" />
        </Picker>
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
});

export default TodoList;

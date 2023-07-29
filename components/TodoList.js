import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import Toast from "react-native-root-toast";

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
    <View className="container">
      <View className="todo-app">
        <Text>Todo List</Text>
        <View className="row">
          <TextInput
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChangeText={(text) => handleInputChange(text)}
          />
          <Pressable onPress={() => handleSubmitText()}>
            <Text>{editTaskId ? "Update" : "Add"}</Text>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={() => handleCompleteAll()}>
            <Text>Complete all tasks</Text>
          </Pressable>
          <Pressable onPress={() => handleClearCompleted()}>
            <Text>Delete comp tasks</Text>
          </Pressable>
        </View>
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={item.completed}
                onValueChange={() => handleTaskCheckboxChange(item.id)}
              />
              <Text>{item.title}</Text>
              <View>
                <Pressable onPress={() => handleEditTask(item.id)}>
                  <Image source="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" />
                </Pressable>
                <Pressable onPress={() => handleDeleteTask(item.id)}>
                  <Image source="https://cdn-icons-png.flaticon.com/128/3096/3096673.png" />
                </Pressable>
              </View>
            </View>
          )}
        />
        <View className="filters">
          <View className="dropdown">
            <Pressable className="dropbtn">
              <Text>Filter</Text>
            </Pressable>
            <View className="dropdown-content">
              <Pressable onPress={() => handleFilterChange("all")}>
                <Text>All</Text>
              </Pressable>
              <Pressable onPress={() => handleFilterChange("uncompleted")}>
                <Text>Uncompleted</Text>
              </Pressable>
              <Pressable onPress={() => handleFilterChange("completed")}>
                <Text>Completed</Text>
              </Pressable>
            </View>
          </View>
          <View className="completed-task">
            <Text>
              Completed: {tasks.filter((task) => task.completed).length}
            </Text>
          </View>
          <View className="remaining-task">
            <Text>Total Tasks: {tasks.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});

export default TodoList;

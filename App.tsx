import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/AntDesign';
import {RNThemeContext, themes, type RNTheme} from './ColorTheme';

interface Task {
  completed: boolean;
  title: string;
  id: string;
}

const QUOTES = [
  "nullius in verba - Royal Society's motto",
  'veni, vidi, vici - Caesar',
  'je pense, donc je suis - Descartes',
  'Gott ist tot - Nietzsche',
];
const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

function App(): JSX.Element {
  const colorScheme = useColorScheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('uncompleted');
  const [editTaskId, setEditTaskId] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todos = await AsyncStorage.getItem('my-todo');
        if (todos !== null) {
          setTasks(JSON.parse(todos));
        }
      } catch (error) {
        console.log('Error fetching todos:', error);
      }
    };

    fetchData();
  }, []);

  const postData = async (updatedTasks: Task[], message?: string) => {
    try {
      setTasks(updatedTasks);
      await AsyncStorage.setItem('my-todo', JSON.stringify(updatedTasks));

      if (message) {
        Toast.show({
          text1: message,
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.log('Error change task:', error);
      Toast.show({text1: 'Error change task', visibilityTime: 2000});
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleSubmitText = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    const addedTask = {
      title: inputValue,
      completed: false,
      id: editTaskId || new Date().getTime().toString(),
    };

    const updatedTasks = editTaskId
      ? tasks.map(task => (task.id === editTaskId ? addedTask : task))
      : [...tasks, addedTask];

    postData(updatedTasks, `${editTaskId ? 'add' : 'update'} task success`);
    setInputValue('');
    if (editTaskId) {
      setEditTaskId(undefined);
    }
  };

  const handleTaskCheckboxChange = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? {...task, completed: !task.completed} : task,
    );
    postData(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    if (taskId === editTaskId) {
      setEditTaskId(undefined);
      setInputValue('');
    }

    postData(updatedTasks, 'Task deleted successfully');
  };

  const handleEditTask = (taskId: string) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find(task => task.id === taskId)!;
    setInputValue(taskToEdit.title);
  };

  const handleCompleteAll = () => {
    const updatedTasks = tasks.map(task => ({...task, completed: true}));
    postData(updatedTasks);
  };

  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    postData(updatedTasks);
  };

  const handleFilterChange = (filterType: string) => {
    setFilter(filterType);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed === true;
    } else if (filter === 'uncompleted') {
      return task.completed === false;
    }
    return true;
  });

  return (
    <RNThemeContext.Provider
      value={colorScheme === 'dark' ? themes.dark : themes.light}>
      <RNThemeContext.Consumer>
        {theme => {
          const styled = styledWithTheme(theme);

          return (
            <SafeAreaView style={styled.container}>
              <StatusBar
                barStyle={
                  colorScheme === 'dark' ? 'dark-content' : 'light-content'
                }
                backgroundColor={theme.BackgroundColor}
              />

              <View style={[styled.section, styled.flexColumn]}>
                <Text style={[styled.text, styled.heading]}>Todo List</Text>
                <Text style={styled.text}>{quote}</Text>
              </View>
              <View style={styled.section}>
                <TextInput
                  style={styled.container}
                  placeholder="Add your todo"
                  value={inputValue}
                  onChangeText={text => handleInputChange(text)}
                  placeholderTextColor={theme.PlaceholderTextColor}
                />
                <Pressable
                  style={styled.pressable}
                  onPress={() => handleSubmitText()}>
                  <Text style={styled.text}>
                    {editTaskId ? 'Update' : 'Add'}
                  </Text>
                </Pressable>
              </View>
              <View style={styled.section}>
                <Pressable
                  style={styled.pressable}
                  onPress={() => handleCompleteAll()}>
                  <Text style={styled.text}>Complete all tasks</Text>
                </Pressable>
                <Pressable
                  style={styled.pressable}
                  onPress={() => handleClearCompleted()}>
                  <Text style={styled.text}>Delete comp tasks</Text>
                </Pressable>
              </View>
              <View style={styled.container}>
                <FlatList
                  data={filteredTasks}
                  renderItem={({item}) => (
                    <View style={styled.section}>
                      <CheckBox
                        value={item.completed}
                        onValueChange={() => handleTaskCheckboxChange(item.id)}
                      />
                      <Text style={styled.container}>{item.title}</Text>
                      <View style={styled.section}>
                        <Pressable onPress={() => handleEditTask(item.id)}>
                          <Icon name="edit" size={24} />
                        </Pressable>
                        <Pressable onPress={() => handleDeleteTask(item.id)}>
                          <Icon name="delete" size={24} />
                        </Pressable>
                      </View>
                    </View>
                  )}
                />
              </View>
              <View style={[styled.section, styled.justifySpace]}>
                <Picker
                  style={styled.checkbox}
                  selectedValue={filter}
                  onValueChange={itemValue => handleFilterChange(itemValue)}
                  dropdownIconColor={theme.TextColor}>
                  <Picker.Item label="all" value="all" />
                  <Picker.Item label="uncompleted" value="uncompleted" />
                  <Picker.Item label="completed" value="completed" />
                </Picker>
                <View>
                  <Text style={styled.text}>
                    Completed: {tasks.filter(task => task.completed).length}
                  </Text>
                </View>
                <View>
                  <Text style={styled.text}>Total Tasks: {tasks.length}</Text>
                </View>
              </View>
            </SafeAreaView>
          );
        }}
      </RNThemeContext.Consumer>
    </RNThemeContext.Provider>
  );
}

const styledWithTheme = (theme: RNTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.BackgroundColor,
      padding: 8,
    },
    heading: {
      fontSize: 32,
      fontWeight: '700',
      textShadowColor: '#ddd',
      textShadowOffset: {width: 0.1, height: 0.1},
      textShadowRadius: 0.5,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.BackgroundColor,
      margin: 8,
    },
    checkbox: {
      width: 160,
      backgroundColor: theme.BackgroundColor,
      color: theme.TextColor,
    },
    flexColumn: {
      flexDirection: 'column',
    },
    justifySpace: {
      justifyContent: 'space-between',
    },
    pressable: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: theme.BorderColor,
      padding: 8,
    },
    text: {
      color: theme.TextColor,
    },
  });

export default App;

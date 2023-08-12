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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={[styles.section, styles.flexColumn]}>
        <Text style={styles.paragraph}>Todo List</Text>
        <Text style={styles.color}>{quote}</Text>
      </View>
      <View style={styles.section}>
        <TextInput
          style={[styles.container, styles.lgText]}
          placeholder="Add your todo"
          value={inputValue}
          onChangeText={text => handleInputChange(text)}
          placeholderTextColor={styles.color.color}
        />
        <Pressable style={styles.pressable} onPress={() => handleSubmitText()}>
          <Text style={styles.lgText}>{editTaskId ? 'Update' : 'Add'}</Text>
        </Pressable>
      </View>
      <View style={styles.section}>
        <Pressable style={styles.pressable} onPress={() => handleCompleteAll()}>
          <Text style={styles.color}>Complete all tasks</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => handleClearCompleted()}>
          <Text style={styles.color}>Delete comp tasks</Text>
        </Pressable>
      </View>
      <View style={[styles.section, styles.container, styles.alignItemsStart]}>
        <FlatList
          data={filteredTasks}
          renderItem={({item}) => (
            <View style={styles.section}>
              <CheckBox
                style={styles.checkbox}
                value={item.completed}
                onValueChange={() => handleTaskCheckboxChange(item.id)}
              />
              <Text style={[styles.paragraph, styles.container]}>
                {item.title}
              </Text>
              <View style={styles.section}>
                <Icon.Button
                  name="edit"
                  onPress={() => handleEditTask(item.id)}
                />
                <Icon.Button
                  name="delete-outline"
                  onPress={() => handleDeleteTask(item.id)}
                />
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
            onValueChange={itemValue => handleFilterChange(itemValue)}
            dropdownIconColor={styles.color.color}>
            <Picker.Item label="all" value="all" />
            <Picker.Item label="uncompleted" value="uncompleted" />
            <Picker.Item label="completed" value="completed" />
          </Picker>
        </View>
        <View>
          <Text style={styles.color}>
            Completed: {tasks.filter(task => task.completed).length}
          </Text>
        </View>
        <View>
          <Text style={styles.color}>Total Tasks: {tasks.length}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullHeight: {
    minHeight: '100%',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
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
    borderColor: '#000',
  },
  lgText: {
    fontSize: 24,
    color: '#000',
  },
  color: {
    color: '#000',
  },
  picker: {
    width: 150,
  },
});

export default App;

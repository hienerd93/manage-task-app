import React from 'react';
import Todo from './src/Todo';
import {Pressable, useColorScheme, StyleSheet} from 'react-native';
import FlashCard from './src/FlashCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {RNThemeContext, themes} from './ColorTheme';

function App(): JSX.Element {
  const [visible, setVisible] = React.useState(true);
  const colorScheme = useColorScheme();

  return (
    <>
      <RNThemeContext.Provider
        value={colorScheme === 'dark' ? themes.dark : themes.light}>
        <Pressable
          style={styled.swapButton}
          onPress={() => setVisible(!visible)}>
          <Icon name="swap" size={24} />
        </Pressable>
        {visible ? <Todo /> : <FlashCard />}
      </RNThemeContext.Provider>
    </>
  );
}

const styled = StyleSheet.create({
  swapButton: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default App;

import React from 'react';
import {Text, View, StyleSheet, FlatList, Pressable} from 'react-native';
import FlipCard from 'react-native-flip-card';
import Icon from 'react-native-vector-icons/AntDesign';

const list = [
  {
    en: 'terminal',
    vn: 'bảng kết nối điều khiển',
  },
  {
    en: 'access',
    vn: 'truy cập',
  },
  {
    en: 'data',
    vn: 'dữ liệu',
  },
];

interface EnVi {
  en: string;
  vn: string;
}

function FlashCard(): JSX.Element {
  const [selected, setSelected] = React.useState<EnVi>();

  return (
    <>
      {selected ? (
        <FlipCard>
          <View style={styles.face}>
            <Pressable
              onPress={() => setSelected(undefined)}
              style={styles.topLeft}>
              <Icon name="back" style={styles.rotate90} size={32} />
            </Pressable>
            <Text style={[styles.rotate90, styles.text]}>{selected.en}</Text>
          </View>
          <View style={styles.back}>
            <Pressable
              onPress={() => setSelected(undefined)}
              style={styles.topLeft}>
              <Icon name="back" style={styles.rotate90} size={32} />
            </Pressable>
            <Text style={[styles.rotate90, styles.text]}>{selected.vn}</Text>
          </View>
        </FlipCard>
      ) : (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <Pressable onPress={() => setSelected(item)}>
              <Text style={styles.textMd}>{item.en}</Text>
            </Pressable>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  face: {
    flex: 1,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    flex: 1,
    backgroundColor: '#f1c40f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotate90: {
    transform: [{rotate: '90deg'}],
  },
  topLeft: {
    alignSelf: 'flex-end',
    alignContent: 'flex-start',
  },
  text: {
    fontSize: 32,
  },
  textMd: {
    fontSize: 24,
  },
});

export default FlashCard;

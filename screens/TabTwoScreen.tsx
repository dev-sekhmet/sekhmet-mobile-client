import * as React from 'react';
import {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Text, View} from '../components/Themed';

const dummyData: any[] = [
  {
    uid: 'a',
    avatar: 'https://i.pravatar.cc/300',
    name: 'Rigobert'
  },
  {
    uid: 'b',
    avatar: 'https://i.pravatar.cc/300',
    name: 'Temate'
  },
  {
    guid: 'c',
    avatar: 'https://i.pravatar.cc/300',
    name: 'Erica'
  }
];

export default function TabTwoScreen(props: any) {
  const {navigation} = props;


  const [keyword, setKeyword] = useState('');
  // 0 is user, 1 is group.
  const [selectedType, setSelectedType] = useState(0);
  // data that will be shown on the list, data could be the list of users, or the list of groups.
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedType === 0) {
      searchUsers();
    } else {
      searchGroups();
    }
  }, [selectedType, keyword]);

  const searchUsers = () => {

    setData(() => dummyData);
  };

  const searchGroups = () => {
    setData(() => dummyData);
  };

  const onKeywordChanged = (keyword: string) => {
    setKeyword(() => keyword);
  };

  const updateSelectedType = (selectedType: number) => () => {
    setSelectedType(() => selectedType);
  };

  const joinGroup = (item: any) => {
    if (item && item.guid && !item.hasJoined) {

    }
  };

  const selectItem = (item: any) => () => {
    // if item is a group. Join the group if the user has not joined before.
    if (item && item.guid && !item.hasJoined) {
      joinGroup(item);
    }
    navigation.push('Chat');
  };

  const getKey = (item: any) => {
    if (item && item.uid) {
      return item.uid;
    }
    if (item && item.guid) {
      return item.guid;
    }
  };

  const renderItems = (evt: any) => {
    const item = evt.item;
    return (
      <TouchableOpacity style={styles.listItem} onPress={selectItem(item)}>
        <Image
          style={styles.listItemImage}
          source={{
            uri: item.avatar ? item.avatar : item.icon
          }}
        />
        <Text style={styles.listItemLabel}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize='none'
          onChangeText={onKeywordChanged}
          placeholder="Search..."
          placeholderTextColor="#000"
          style={styles.input}
        />
      </View>
      <View style={styles.searchActionContainer}>
        <TouchableOpacity
          style={[styles.searchActionBtn, styles.searchLeftActionBtn, selectedType === 0 && styles.searchActionBtnActive]}
          onPress={updateSelectedType(0)}>
          <Text style={[styles.searchActionLabel, selectedType === 0 && styles.searchActionLabelActive]}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.searchActionBtn, styles.searchRightActionBtn, selectedType === 1 && styles.searchActionBtnActive]}
          onPress={updateSelectedType(1)}>
          <Text style={[styles.searchActionLabel, selectedType === 1 && styles.searchActionLabelActive]}>Group</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        <FlatList
          data={data}
          renderItem={renderItems}
          keyExtractor={(item, index) => getKey(item)}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    borderColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginHorizontal: 8,
    padding: 12,
  },
  searchActionContainer: {
    borderRadius: 8,
    flexDirection: 'row',
    margin: 8,
  },
  searchActionBtn: {
    backgroundColor: '#fff',
    borderColor: '#000',
    flex: 1,
    fontSize: 16,
    padding: 8
  },
  searchLeftActionBtn: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 0,
  },
  searchRightActionBtn: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginLeft: 0,
  },
  searchActionBtnActive: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
    borderRadius: 8,
  },
  searchActionLabel: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  searchActionLabelActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  listItemImage: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  listItemLabel: {
    fontSize: 16,
  }
});

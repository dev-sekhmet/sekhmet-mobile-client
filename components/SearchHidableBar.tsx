import {useEffect, useState} from "react";
import {useAppDispatch} from "../api/store";
import {onPerformSearchQuery} from "../api/search/search.reducer";
import {Dimensions, Pressable, View} from "react-native";
import {Searchbar} from "react-native-paper";
import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const SearchHidableBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showInputSearch, setShowInputSearch] = useState(false);
    const dispatch = useAppDispatch();
    const onChangeSearch = query => {
        setSearchQuery(query);
        dispatch(onPerformSearchQuery(query))
    };

    useEffect(() => {
        return () => {
            setShowInputSearch(false)
        };
    }, []);

    return <View style={{flexDirection: 'row'}}>
        {showInputSearch && <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            autoFocus={true}
            onBlur={() => setShowInputSearch(false)}
            style={{width: width * 0.8, height: 40}}
        />}
        {!showInputSearch && <Pressable
            onPress={() => setShowInputSearch(true)}
            style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
                name="search"
                size={25}
                color="grey"
                style={{marginRight: 15, fontWeight: 'bold'}}
            />
        </Pressable>}
    </View>;
}

export default SearchHidableBar
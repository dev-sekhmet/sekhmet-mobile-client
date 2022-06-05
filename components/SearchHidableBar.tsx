import * as React from "react";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../api/store";
import {Dimensions, Pressable, View} from "react-native";
import {Searchbar} from "react-native-paper";
import {FontAwesome} from "@expo/vector-icons";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const SearchHidableBar = ({onChangeSearch, value}) => {
    const [showInputSearch, setShowInputSearch] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        return () => {
            setShowInputSearch(false)
        };
    }, []);

    return <View style={{flexDirection: 'row'}}>
        {showInputSearch && <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={value}
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
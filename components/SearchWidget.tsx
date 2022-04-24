import {useEffect, useState} from "react";
import {useAppDispatch} from "../api/store";
import {onPerformSearchQuery} from "../api/search/search.reducer";
import {Dimensions, Pressable, View} from "react-native";
import {Searchbar} from "react-native-paper";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
    type SearchWidgetParam = {
        onChangeSearch?: (query) => void;
        style?: any;
        iconStyle?: any;
        useLoop?: boolean;
};
const SearchWidget = (searchWidgetParam : SearchWidgetParam) => {
    const [showInputSearch, setShowInputSearch] = useState(false);
    const {onChangeSearch, iconStyle, style, useLoop} = searchWidgetParam;
    useEffect(() => {
        return () => {
            setShowInputSearch(false)
        };
    }, []);

    return <View style={[style, {flexDirection: 'row'}]}>
        {(!useLoop || showInputSearch) && <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            autoFocus={true}
            onBlur={() => setShowInputSearch(false)}
            style={{width: width * 0.8, height: 40}}
        />}
        {useLoop && !showInputSearch && <Pressable
            onPress={() => setShowInputSearch(true)}
            style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
                name="search"
                size={25}
                color="grey"
                style={[iconStyle, {marginRight: 15, fontWeight: 'bold'}]}
            />
        </Pressable>}


    </View>;
}
export default SearchWidget;
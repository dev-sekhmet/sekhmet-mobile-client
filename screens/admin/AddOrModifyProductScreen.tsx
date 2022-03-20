import {useAppDispatch, useAppSelector} from "../../api/store";
import {Controller, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {reset} from "../../api/products/products.reducer";
import {successToast} from "../../components/toast";
import {
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {Button} from "react-native-paper";
import {Select} from "@mobile-reality/react-native-select-pro";
import {OptionType} from "@mobile-reality/react-native-select-pro/src/types/index";
import {AntDesign, Entypo} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const productTypeOptions: OptionType[] = [
    {value: 'breuvage', label: 'Breuvage'},
    {value: 'platDiet', label: 'Plat Diététiques'},
    {value: 'cereal', label: 'Cereal'}
];
const publishedTypeOptions: OptionType[] = [
    {value: 'published', label: 'Publié'},
    {value: 'unpublished', label: 'Non publié'}
];
const atoutData = ['Dégresse Progressivement'];
const atoutInputFieldName = 'atoutInputField';

const AddOrModifyProduct = () => {
    const updateSuccess = useAppSelector(state => state.products.updateSuccess);
    const dispatch = useAppDispatch();

    const {control, handleSubmit, getValues, setValue, formState: {errors}} = useForm({
        defaultValues: {
            productName: '',
            type: productTypeOptions[0],
            published: publishedTypeOptions[0],
            descripton: '',
            [atoutInputFieldName]: ''
        }
    });

    const [atouts, setAtouts] = useState(atoutData);
    const [isHideFieldEnter, setIsHideFieldEnter] = useState(false);
    const [showAtoutInputField, setShowAtoutInputField] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const onSubmit = data => console.log(data);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, []);

    useEffect(() => {
        if (updateSuccess) {
            successToast("Success", "Success save ")
        }
    }, [updateSuccess]);

    const handleValidSubmit = values => {
        console.log(values);
        console.log('atouts', atouts);
        /*        dispatch(
                    createEntity({
                        ...values,
                        'atouts', atouts
                    })
                );*/
    };
    const removeAtout = item => {
        if (item) {
            setAtouts(atouts.filter((i) => i !== item))
        } else {
            setValue(atoutInputFieldName, '');
            setShowAtoutInputField(false);
        }
    };
    const addFieldComponent = () => {
        setShowAtoutInputField(true);
    };
    const validateAtout = () => {
        const atoutValue = getValues(atoutInputFieldName);
        if (atoutValue) {
            setAtouts([...atouts, atoutValue]);
            setShowAtoutInputField(false);
            setValue(atoutInputFieldName, '');
        }
    };


    // Image picker
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.cancelled) {
            // @ts-ignore
            console.log('result.uri', result.uri)
            // @ts-ignore
            setImage(result.uri);
        }
    };

    const fieldOutOfScrollView = [
        {
            id: 2,
            component: <View>

                {/*For product name*/}
                <View style={styles.fieldSeparator}>
                    <Text style={styles.text}>Nom du produit</Text>
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={styles.inputText}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="productName"
                    />
                    {errors.productName && <Text style={{color: 'red'}}>This is required.</Text>}
                </View>

                {/*    For type*/}
                <View style={styles.fieldSeparator}>
                    <Text style={styles.text}>Type de produit</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <Select
                                onSelect={onChange}
                                defaultOption={productTypeOptions[0]}
                                options={productTypeOptions}
                            />
                        )}
                        name="type"
                    />
                    {errors.type && <Text style={{color: 'red'}}>This is required.</Text>}
                </View>

                {/*    For descripton*/}
                <View style={styles.fieldSeparator}>
                    <Text style={styles.text}>Description</Text>
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 300,
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={[styles.inputText, {height: 60}]}
                                multiline={true}
                                numberOfLines={4}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="descripton"
                    />
                    {errors.descripton && <Text style={{color: 'red'}}>This is required.</Text>}
                </View>
            </View>
        },
        {
            id: 1,
            component: <View>
                <View style={[styles.fieldSeparator]}>
                    <Text style={styles.text}>Ajouter un bienfait ou atout</Text>
                    <FlatList data={atouts}
                              keyExtractor={(item: any) => item}
                              renderItem={({item, index}) => (
                                  <View style={[styles.inputText, {
                                      alignItems: 'center',
                                      backgroundColor: '#e8e8e8',
                                      flex: 1, justifyContent: 'space-between',
                                      flexDirection: 'row',
                                      marginBottom: 10
                                  }]}>
                                      <Text style={{textAlign: 'center', paddingHorizontal: 0}}>{item}</Text>
                                      <TouchableOpacity style={{alignItems: 'flex-end'}}
                                                        onPress={() => removeAtout(item)}>
                                          <AntDesign name="close" size={20} color="black"/>
                                      </TouchableOpacity>
                                  </View>)}/>

                    <TouchableOpacity style={{
                        flex: 1,
                        padding: 5,
                        borderRadius: 10,
                        maxHeight: height * 0.05,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }} onPress={() => addFieldComponent()}>
                        <AntDesign name="plus" size={15} color={Colors.light.sekhmetGreen}/>
                        <Text style={{marginLeft: 10, color: Colors.light.sekhmetGreen}}>Ajouter un champ</Text>
                    </TouchableOpacity>

                    {showAtoutInputField && <View style={[styles.inputText, {
                        alignItems: 'center',
                        flex: 1, justifyContent: 'space-between',
                        flexDirection: 'row',
                        marginBottom: 10
                    }]}>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={{width: '85%'}}
                                    onBlur={() => {
                                        onBlur();
                                        setIsHideFieldEnter(false);
                                    }}
                                    onChangeText={onChange}
                                    onFocus={() => setIsHideFieldEnter(true)}
                                    value={value}
                                />
                            )}
                            name="atoutInputField"
                        />
                        {errors.atoutInputField && <Text style={{color: 'red'}}>This is required.</Text>}
                        <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={() => validateAtout()}>
                            <AntDesign name="check" size={20} color={Colors.light.sekhmetGreen}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={() => removeAtout(null)}>
                            <AntDesign name="close" size={20} color="black"/>
                        </TouchableOpacity>
                    </View>
                    }
                </View>

                {/*For product image*/}
                <View style={styles.fieldSeparator}>
                    <Text style={styles.text}>Uploader une image</Text>
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TouchableOpacity style={{
                                alignItems: 'center',
                                flex: 1, justifyContent: 'center',
                                marginBottom: 10,
                                height: height * 0.1,
                                borderColor: Colors.light.sekhmetGreen,
                                borderWidth: 1.5,
                                borderStyle: 'dashed',
                                borderRadius: 3
                            }} onPress={pickImage}>
                                <Entypo name="upload" size={24} color={Colors.light.sekhmetGreen}/>
                            </TouchableOpacity>

                        )}
                        name="productName"
                    />
                    {errors.productName && <Text style={{color: 'red'}}>This is required.</Text>}
                </View>
                {/*    For published?*/}
                <View style={styles.fieldSeparator}>
                    <Text style={styles.text}>Statut</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <Select
                                onSelect={onChange}
                                defaultOption={publishedTypeOptions[0]}
                                options={publishedTypeOptions}
                            />
                        )}
                        name="published"
                    />
                    {errors.published && <Text style={{color: 'red'}}>This is required.</Text>}
                </View>

                <View
                    style={{paddingVertical: 10, marginTop: 20, marginBottom: 20, alignItems: 'center'}}>
                    <Button mode="contained" onPress={handleSubmit(handleValidSubmit)}
                            contentStyle={{paddingHorizontal: 50}}
                            style={{borderRadius: 20, marginBottom: 10}} color="#62A01A">
                        Terminer
                    </Button>
                </View>
            </View>
        }
    ];
    return (
        <KeyboardAvoidingView
            style={{justifyContent: 'center', backgroundColor: 'white', height: isHideFieldEnter ? "50%" : 'auto'}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <FlatList data={fieldOutOfScrollView}
                      showsVerticalScrollIndicator={false}
                      style={[styles.view, {marginTop: 15}]}
                      keyExtractor={(item: any) => item.id}
                      renderItem={({item, index}) => (
                          item.component)}/>
        </KeyboardAvoidingView>
    )
}
export default AddOrModifyProduct;


const styles = StyleSheet.create({
    inputText: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 3,
        paddingHorizontal: 8
    },
    text: {textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3},
    fieldSeparator: {marginBottom: 10, marginTop: 5},
    view: {backgroundColor: 'transparent', marginRight: 20, marginLeft: 20, marginTop: 20, flexDirection: "column"}
});
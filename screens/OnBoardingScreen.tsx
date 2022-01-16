import React, {useRef, useState} from 'react';
import {
    SafeAreaView,
    Image,
    StyleSheet,
    FlatList,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import TermsConditionsScreen from "./registration/TermsConditionsScreen";

const {width, height} = Dimensions.get('window');

const slides = [
    {
        id: '1',
        image: require('../assets/images/onboarding/011.png'),
        title: 'FAITES-VOUS SUIVRE PAR DES EXPERTS',
        subtitle: 'Locate people you care about in real time, and see where they are, View directions on the map.',
    },
    {
        id: '2',
        image: require('../assets/images/onboarding/022.png'),
        title: 'AU TRAVERS D’UNE ALIMENTATION SAINE',
        subtitle: 'Know when they are in danger thanks to notifications (accident, illness, insecurity, etc.)',
    },
    {
        id: '3',
        image: require('../assets/images/onboarding/033.png'),
        title: 'DES CONSEILS POUR GARDER LA FORME',
        subtitle: 'See what your loved ones are doing. Discover what\'s happening around, and share your daily moments',
    },
];

const Slide = ({item}) => {
    return (
        <View>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={item?.image}
                    style={{height: '70%', width, resizeMode: 'center'}}
                />
            </View>
            <View style={{width, alignItems: 'center'}}>
                <Text style={styles.title}>{item?.title}</Text>
                    <Text style={styles.subtitle}>{item?.subtitle}</Text>
            </View>
        </View>
    );
};

const OnBoardingScreen = ({done}) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const ref = useRef();
    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    // const goToNextSlide = () => {
    //     const nextSlideIndex = currentSlideIndex + 1;
    //     if (nextSlideIndex != slides.length) {
    //         const offset = nextSlideIndex * width;
    //         // @ts-ignore
    //         ref?.current.scrollToOffset({offset});
    //         setCurrentSlideIndex(currentSlideIndex + 1);
    //     }
    // };

    const skip = () => {
        const lastSlideIndex = slides.length - 1;
        const offset = lastSlideIndex * width;
        // @ts-ignore
        ref?.current.scrollToOffset({offset});
        setCurrentSlideIndex(lastSlideIndex);
    };

    const Footer = () => {
        return (
            <View
                style={{
                    height: height * 0.20,
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                }}>
                {/* Indicator container */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 20,
                        paddingTop: 15
                    }}>
                    {/* Render indicator */}
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlideIndex == index && {
                                    backgroundColor: '#62A01A',
                                    width: 25,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/*Skip button*/}
                <View style={{marginTop: 0}}>
                    {
                        currentSlideIndex == slides.length - 1
                        ?
                            <View style={{height: 40}}>
                                <TouchableOpacity onPress={done} style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                    <View style={{borderRadius: 12, backgroundColor: 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5}}>
                                        <Text style={{color: '#62A01A',}}>Commencer {'>>'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            :<View style={{height: 50}}>
                                <TouchableOpacity onPress={skip} style={{display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                                    <View style={{borderRadius: 12, backgroundColor: 'whitesmoke', paddingHorizontal: 10, paddingVertical: 5}}>
                                        <Text style={{color: '#62A01A',}}>Skip {'>>'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar hidden={true}/>
                    <FlatList
                        ref={ref}
                        onMomentumScrollEnd={updateCurrentSlideIndex}
                        contentContainerStyle={{height: height * 0.8, justifyContent: 'center'}}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={slides}
                        pagingEnabled
                        renderItem={({item}) => <Slide item={item} />}
                    />
                    <Footer />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    subtitle: {
        color: 'grey',
        fontSize: 13,
        marginTop: 10,
        maxWidth: '70%',
        textAlign: 'center',
        lineHeight: 20,
    },
    title: {
        color: 'black',
        fontSize: 22,
        maxWidth: '90%',
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    indicator: {
        height: 4,
        width: 10,
        backgroundColor: 'grey',
        marginHorizontal: 3,
        borderRadius: 5,
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OnBoardingScreen;

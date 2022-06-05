import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import Toast from 'react-native-toast-message';
import {setupAxiosInterceptors} from "./api/authentification/authentication.reducer";
import {Provider} from 'react-redux';
import {store} from "./api/store";
import {BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import {NativeViewGestureHandler} from "react-native-gesture-handler";

setupAxiosInterceptors(() => console.log('login.error.unauthorized'));

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <ActionSheetProvider>
                        <NativeViewGestureHandler disallowInterruption={true}>
                        <BottomSheetModalProvider>
                            <SelectProvider>
                            <Navigation colorScheme={colorScheme}/>
                            </SelectProvider>
                        </BottomSheetModalProvider>
                        </NativeViewGestureHandler>
                    </ActionSheetProvider>
                    <StatusBar/>
                    <Toast/>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

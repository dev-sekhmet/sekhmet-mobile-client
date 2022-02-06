import Toast from "react-native-toast-message";

const showToast = (type: string, title: string, message: string) => {
    Toast.show({
        type: type,
        text1: title,
        position: 'bottom',
        text2: message
    });
}
export const successToast = (successTitle: string, successMessage: string) => {
    showToast('success', successTitle, successMessage);
}
export const errorToast = (errorTitle: string, errorsMessage: string) => {
    showToast('error', errorTitle, errorsMessage);
}
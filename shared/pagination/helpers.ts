
import { NOTIFICATION_TIMEOUT, UNEXPECTED_ERROR_MESSAGE } from "../../constants/messages";
import {NotificationsType, NotificationVariantType} from "../../api/notification/notification.reducer";
import {useDispatch} from "react-redux";
import {errorToast} from "../../components/toast";

export const getTypingMessage = (typingData: string[]): string =>
  typingData.length > 1
    ? `${typingData.length + " participants are typing..."}`
    : `${typingData[0] + " is typing..."}`;

export const handlePromiseRejection = async (
  func: () => void
): Promise<void> => {
  try {
    console.log("SSS handlePromiseRejection")
    await func();
  } catch {
    console.log("EEE handlePromiseRejection")
    errorToast("Error", UNEXPECTED_ERROR_MESSAGE)
    return Promise.reject(UNEXPECTED_ERROR_MESSAGE);
  }
};

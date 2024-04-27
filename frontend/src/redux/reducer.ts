// Libraries
import actionsTypes from "./actionsTypes";
import {
  NotificationType,
} from "../components/Tools/Types";

type State = {
  currentNotification: NotificationType;
};

const initialState: State = {
  currentNotification: {
    open: false,
    message: "",
    severity: "info",
  },
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case actionsTypes.SET_CURRENT_NOTIFICATION:
      return {
        ...state,
        currentNotification: action.payload.currentNotification,
      };
    default:
      return state;
  }
}

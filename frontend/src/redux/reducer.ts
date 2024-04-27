// Libraries
import actionsTypes from "./actionsTypes";
import {
  NotificationType,
  Article
} from "../components/Tools/Types";

type State = {
  currentNotification: NotificationType;
  currentArticles : Article[]
};

const initialState: State = {
  currentNotification: {
    open: false,
    message: "",
    severity: "info",
  },
  currentArticles : []
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case actionsTypes.SET_NOTIFICATION:
      return {
        ...state,
        currentNotification: action.payload.currentNotification,
      };
    case actionsTypes.SET_ARTICLES:
      return {
        ...state,
        currentArticles: action.payload.newArticles,
      };
    case actionsTypes.ADD_ARTICLE:
      return {
        ...state,
        currentArticles: [...state.currentArticles, action.payload.newArticle],
      };
    default:
      return state;
  }
}

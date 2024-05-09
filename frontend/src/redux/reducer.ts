// Libraries
import actionsTypes from "./actionsTypes";
import { Notification, Article } from "../components/Tools/Types";

type State = {
  currentNotification: Notification;
  currentArticles: Article[];
};

const initialState: State = {
  currentNotification: {
    open: false,
    message: "",
    severity: "info",
  },
  currentArticles: [],
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
    case actionsTypes.EDIT_ARTICLE:
      return {
        ...state,
        currentArticles: state.currentArticles.map((article) =>
          article.id === action.payload.id ? action.payload.article : article
        ),
      };
    case actionsTypes.DELETE_ARTICLE:
      return {
        ...state,
        currentArticles: state.currentArticles.filter(
          (article) => article.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
}

import { Notification, Severity, Article } from "../components/Tools/Types";
import actionsTypes from "./actionsTypes";

export function SET_NOTIFICATION(message: string, severity: Severity) {
  const newNotification: Notification = {
    timestamp: new Date().getTime(),
    open: true,
    message: message,
    severity: severity,
  };
  return {
    type: actionsTypes.SET_NOTIFICATION,
    payload: { currentNotification: newNotification },
  };
}

export function DELETE_NOTIFICATION() {
  const newNotification: Notification = {
    open: false,
    message: "",
    severity: "info",
  };
  return {
    type: actionsTypes.SET_NOTIFICATION,
    payload: { currentNotification: newNotification },
  };
}

export function SET_ARTICLES(newArticles: Article[]) {
  return {
    type: actionsTypes.SET_ARTICLES,
    payload: { newArticles: newArticles },
  };
}

export function ADD_ARTICLE(newArticle: Article) {
  return {
    type: actionsTypes.ADD_ARTICLE,
    payload: { newArticle: newArticle },
  };
}

export function EDIT_ARTICLE(id: number, article: Article) {
  return {
    type: actionsTypes.EDIT_ARTICLE,
    payload: { id: id, article: article },
  };
}

export function DELETE_ARTICLE(id: number) {
  return {
    type: actionsTypes.DELETE_ARTICLE,
    payload: { id: id },
  };
}

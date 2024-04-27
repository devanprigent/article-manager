// Libraries
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Article, NotificationType } from "../components/Tools/Types";

export const useNotification = (): NotificationType =>
  useSelector((state: RootState) => state.currentNotification);

export const useArticles = (): Article[] =>
  useSelector((state: RootState) => state.currentArticles);
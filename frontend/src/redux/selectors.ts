// Libraries
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Article, Notification } from "../components/Tools/Types";

export const useNotification = (): Notification =>
  useSelector((state: RootState) => state.currentNotification);

export const useArticles = (): Article[] =>
  useSelector((state: RootState) => state.currentArticles);

// Libraries
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Article, Notification, Tag } from "../components/Tools/Types";

export const useNotification = (): Notification =>
  useSelector((state: RootState) => state.notification);

export const useArticles = (): Article[] => {
  const articles = useSelector((state: RootState) => state.articles);
  const orderedArticles = [...articles].sort(
    (a, b) =>
      new Date(b.date_modification).getTime() -
      new Date(a.date_modification).getTime()
  );
  return orderedArticles;
};

export const useTags = (): Tag[] =>
  useSelector((state: RootState) => state.tags);

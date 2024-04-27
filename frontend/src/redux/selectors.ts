// Libraries
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { NotificationType } from "../components/Tools/Types";

export const useNotification = (): NotificationType =>
  useSelector((state: RootState) => state.currentNotification);

// Libraries
import { useDispatch } from "react-redux";
import { proxy, requestTypes } from "../Tools/Proxy";
import { DELETE_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

function useRemoveArticle() {
  const dispatch = useDispatch();

  async function remove(itemId: number) {
    const { error, message } = await proxy(requestTypes.DELETE_ARTICLE, itemId);
    if (!error) {
      dispatch(DELETE_ARTICLE(itemId));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "warning"));
  }

  return remove;
}

export default useRemoveArticle;

// Libraries
import { useDispatch } from "react-redux";
import { Article } from "../Tools/Types";
import { proxy, requestTypes } from "../Tools/Proxy";
import { EDIT_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

function useEditArticle() {
  const dispatch = useDispatch();

  async function edit(article: Article) {
    const { error, message } = await proxy(requestTypes.EDIT_ARTICLE, article);
    if (!error) {
      dispatch(EDIT_ARTICLE(article.id, article));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "warning"));
  }

  return edit;
}

export default useEditArticle;

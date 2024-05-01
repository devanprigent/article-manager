// Libraries
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// Configuration Files
import { Article } from "./Types";
import { proxy, requestTypes } from "./Proxy";
import { SET_ARTICLES, SET_NOTIFICATION } from "../../redux/actionsCreators";

function DataLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const { error, message, data } = await proxy(requestTypes.FETCH_ARTICLES);
      if (!error) {
        const articles = data as Article[];
        dispatch(SET_ARTICLES(articles));
        return;
      }
      dispatch(SET_NOTIFICATION(message, "error"));
    }

    fetchData().catch((err) => console.error(err));
  }, [dispatch]);
}

export default DataLoader;

// Libraries
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// Configuration Files
import { Tag } from "../Tools/Types";
import { proxy, requestTypes } from "../Tools/Proxy";
import { SET_TAGS, SET_NOTIFICATION } from "../../redux/actionsCreators";

function useLoadTags() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const { error, message, data } = await proxy(requestTypes.FETCH_TAGS);
      if (!error) {
        const tags = data as Tag[];
        dispatch(SET_TAGS(tags));
        return;
      }
      dispatch(SET_NOTIFICATION(message, "error"));
    }

    fetchData().catch((err) => console.error(err));
  }, [dispatch]);
}

export default useLoadTags;

// Libraries
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { useNotification } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { DELETE_NOTIFICATION } from "../../redux/actionsCreators";
import { severityColors } from "../Tools/Constants";

function NotificationBox() {
  const dispatch = useDispatch();
  const notification = useNotification();
  const color: string = severityColors[notification.severity];

  function handleClose() {
    dispatch(DELETE_NOTIFICATION());
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={notification.open}
      onClose={handleClose}
      autoHideDuration={3000}
      key={notification.timestamp}
    >
      <SnackbarContent
        style={{
          backgroundColor: color,
        }}
        message={
          <span id="client-snackbar text-black">{notification.message}</span>
        }
      />
    </Snackbar>
  );
}

export default NotificationBox;

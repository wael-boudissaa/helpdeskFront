import AuthContext from "@/context/AuthContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  IconButton,
  Textarea,
  Avatar,
} from "@material-tailwind/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import SnackBar from "../SnackBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";

function Message({ userIconSrc, firstName, lastName, date, message }) {
  const adjustDate = (isoDate) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="flex items-start space-x-4 py-2">
      <Avatar src={userIconSrc} alt="User Icon" size="sm" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{firstName}</span>
          <span className="font-medium">{lastName}</span>
          <span className="text-xs text-gray-400">{adjustDate(date)}</span>
        </div>
        <p className="max-w-md break-words text-gray-700 lg:max-w-2xl">
          {message}
        </p>
      </div>
    </div>
  );
}

function Discussion({
  open,
  handleOpen,
  messages,
  discussionTicketId,
  discussionTicketState,
  refreshMessages,
}) {
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [color, setColor] = useState("");

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };
  const showToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
    });
  };
  const postMessage = async () => {
    try {
      const authorization = "Bearer " + authTokens.access;
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify({
          idTicket: discussionTicketId,
          text: text,
        }),
      });
      if (response.ok) {
        refreshMessages(discussionTicketId);
        setText("");
      } else if (response.status == 401) {
        const currentTime = Date.now() / 1000;
        const t = authTokens
        const u = jwtDecode(t.refresh);
        if (u.exp < currentTime) {
          alert("Your session has expired, please log in again");
          logoutUser();
        } else {
          await updateToken();
          showToast("Sending Failed, Try again");
        }
      }
    } catch (err) {
      showToast("Sending Failed, Try again");
    }
  };
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        className="min-w-fit overflow-auto"
      >
        <div className="flex items-center justify-between">
          <DialogHeader>Ticket Discussion</DialogHeader>
        </div>
        <DialogBody className="flex flex-col gap-6" divider>
          <ToastContainer />
          <div
            ref={messagesContainerRef}
            className="messages flex h-64 w-96 flex-col overflow-auto p-4 lg:w-[896px]"
          >
            {messages.map((message) => {
              return (
                <Message
                  key={message.idMessage}
                  userIconSrc={
                    message.source.type === "applicant"
                      ? "/img/dis_user.jpg"
                      : "/img/expert.jpg"
                  }
                  firstName={message.source.first_name}
                  lastName={message.source.last_name}
                  date={message.creationDate}
                  message={message.text}
                />
              );
            })}
          </div>
          {discussionTicketState === "waiting" && user.type !== "admin" && (
            <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border border-blue-gray-500/20 bg-blue-500/10 p-2">
              <Textarea
                value={text}
                rows={1}
                resize={false}
                maxLength={800}
                placeholder="Your Message"
                className="flex min-h-full items-center !border-0 focus:border-transparent"
                containerProps={{
                  className: "grid h-full",
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    postMessage();
                  }
                }}
              />
              <div>
                <IconButton
                  onClick={postMessage}
                  variant="text"
                  className="rounded-full"
                >
                  <PaperAirplaneIcon className="text-black-300 h-5 w-5" />
                </IconButton>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex flex-wrap gap-4 space-x-2">
          <Button variant="outlined" color="red" onClick={handleOpen}>
            close
          </Button>
          {/* <Button variant="gradient" color="green" onClick={postMessage}>
            send message
          </Button> */}
        </DialogFooter>
      </Dialog>
      {showSnackbar && (
        <SnackBar
          color={color}
          snackbarMessage={snackbarMessage}
          closeSnackBar={handleSnackbarClose}
        />
      )}
    </>
  );
}

export default Discussion;

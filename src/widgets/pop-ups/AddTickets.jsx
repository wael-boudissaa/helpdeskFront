import React, { useContext, useState } from "react";
import {
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Select,
  Option,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import AuthContext from "@/context/AuthContext";
import SnackBar from "../SnackBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AddTickets({ open, handleOpen }) {
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  const versionOptions = ["Application", "IT Assistance", "Hardware"];
  const priorities = ["High", "Medium", "Low"];
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState(null);
  const [issue, setIssue] = useState("");
  const [categorie, setCategorie] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [color, setColor] = useState("");

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };
  const dynamicOptions = {
    Application: ["Software Install", "System Install", "ERP Maintenance"],
    "IT Assistance": [
      "Activation License",
      "MS Teams Account",
      "Email Setup",
      "Resource Access",
      "Wi-Fi Access",
      "Internet Access",
    ],
    Hardware: [
      "Phone/Deck Install",
      "Network Printer",
      "Supplies Change",
      "Extra Screen Setup",
      "PC/Laptop Care",
      "TV System Care",
    ],
  };
  const [selectedVersionOptions, setSelectedVersionOptions] = useState([]);

  const handleClose = () => {
    handleOpen();
    setCategorie("");
    setIssue("");
    setMessage("");
    setPriority("");
    setSelectedVersionOptions([]);
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Close after 3 seconds
      hideProgressBar: true, // Hide the progress bar
    });
  };

  const postData = async () => {
    let missingFields = [];
    if (!categorie) missingFields.push("category");
    if (!issue) missingFields.push("issue");
    if (!priority) missingFields.push("priority");
    console.log(missingFields);
    if (missingFields.length == 0) {
      try {
        const authorization = "Bearer " + authTokens.access;
        const response = await fetch("http://127.0.0.1:8000/api/tickets/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify({
            priority: priority,
            issue: issue,
            category: categorie,
          }),
        });
        if (response.ok) {
          setSnackbarMessage("Successfully sent !");
          setShowSnackbar(true);
          setColor("bg-green-300");
          handleClose();
        } else if (response.status == 401) {
          alert("Your session has expired, please log in again");
          logoutUser();
        } else {
          const data = await response.json();
          console.log(data);
          setSnackbarMessage(`${data.msg}`);
          setShowSnackbar(true);
          setColor("bg-red-300");
          handleClose();
        }
      } catch (err) {
        setSnackbarMessage(`Network error`);
        setShowSnackbar(true);
        setColor("bg-red-300");
      }
    }else{
      let message = "Missing required fields: "
      let i = 0;
      for (let f of missingFields ) {
        if (i == missingFields.length-1) message += f;
        else message += f+", ";
        i++;
      };
      console.log(message);
      showErrorToast(message);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        handler={handleClose}
        className="min-w-fit overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <DialogHeader>New Ticket</DialogHeader>
        </div>
        <DialogBody className="flex items-center justify-center" divider>
          <ToastContainer />
          <div className="grid gap-6">
            <Typography variant="h6" color="red" textGradient>
              * means that the field is required
            </Typography>
            <Input
              label="Username"
              value={user.username}
              readOnly
              className=""
            />
            <div className="flex flex-wrap justify-between gap-6">
              <div className="">
                <Select
                  label="Select Category*"
                  className=""
                  onChange={(value) => {
                    setSelectedVersionOptions(dynamicOptions[value]);
                    setCategorie(value);
                  }}
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  {versionOptions.map((version) => {
                    return <Option value={version}>{version}</Option>;
                  })}
                </Select>
              </div>
              <div className="">
                <Select
                  label="Select Issue title*"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                  onChange={(value) => setIssue(value)}
                >
                  {selectedVersionOptions?.map((version) => {
                    return <Option value={version}>{version}</Option>;
                  })}
                </Select>
              </div>
              <div className="">
                <Select
                  label="Select Priority*"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                  onChange={(value) => {
                    setPriority(value);
                  }}
                >
                  {priorities?.map((value, key) => {
                    return <Option value={key + 1}>{value}</Option>;
                  })}
                </Select>
              </div>
              <Textarea maxLength={800} label="Message" />
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex flex-wrap gap-4 space-x-2">
          <Button variant="outlined" color="red" onClick={handleClose}>
            close
          </Button>
          <Button variant="gradient" color="green" onClick={postData}>
            send message
          </Button>
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

import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  // Textarea,
  Select,
  Dialog,
  Input,
  Typography,
  Option,
} from "@material-tailwind/react";
import AuthContext from "@/context/AuthContext";
import SnackBar from "../SnackBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
const AddUser = ({ handleAddUser, addUser, dataSent, setDataSent }) => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [typeUser, setTypeUser] = useState("");
  const { authTokens, updateToken } = useContext(AuthContext);
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [color, setColor] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [password, setPassword] = useState("");
  const handleSnackbarClose = () => {
    setShowSnackBar(!SnackBar);
  };
  //* Sent the data to the backend
  const showToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
    });
  };
  const sentData = async () => {
    let listFieldMissing = [];
    if (!userName) listFieldMissing.push("username");
    if (!password) listFieldMissing.push("password");
    if (!firstName) listFieldMissing.push("first name");
    if (!secondName) listFieldMissing.push("second name");
    if (!typeUser) listFieldMissing.push("type");
    if (!job) listFieldMissing.push("job");
    if (!email) listFieldMissing.push("email");

    console.log(listFieldMissing);
    if (listFieldMissing.length == 0) {
      const authorization = "Bearer " + authTokens.access;
      try {
        const response = await fetch("http://127.0.0.1:8000/api/profiles/", {
          method: "POST",
          headers: {
            Authorization: authorization,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: userName,
            first_name: firstName,
            second_name: secondName,
            type: typeUser,
            job: job,
            email: email,
            password: password,
          }),
        });
        if (response.status === 200) {
          setDataSent(!dataSent);
          //*Snack bar
          setShowSnackBar(!showSnackbar);
          setColor("bg-green-300");
          setSnackbarMessage(`Successfully add ${typeUser}`);
          handleAddUser();
        } else if (response.status === 406) {
          //*Snack bar
          showToast(`${userName} Duplicated`);
        } else if (response.status == 401){
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
    } else {
      let message = "Missing required fields :  ";
      let a = 0;
      for (let i of listFieldMissing) {
        if (a == listFieldMissing.length - 1) message += i;
        else message += i + ", ";
        a++;
      }

      showToast(message);
    }
  };

  //! Function to reset all the fields when submit

  //! function to define the Job or domaine d'expertisee
  const jobHandler = (type) => {
    if (type === "expert") return "Domaine d'expertise";
    else return "Job Title";
  };
  const optionsUser = ["expert", "applicant"];
  return (
    <div>
      <Dialog
        open={addUser}
        handler={handleAddUser}
        className="min-w-fit overflow-y-auto md:w-[]"
      >
        <div className="flex items-center justify-between">
          <DialogHeader>New User </DialogHeader>
        </div>
        <DialogBody className="flex items-center " divider>
          <ToastContainer />
          <div className="grid gap-6">
            <Typography variant="h6" color="red" textGradient>
              All Fields are Required 
            </Typography>
            <Input
              label="Username"
              className=""
              onChange={(e) => setUserName(e.target.value)}
            />

            <Input
              type="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            ></Typography>
            <div className="flex flex-wrap justify-between gap-6">
              <Input
                label="First Name"
                className=""
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Second Name"
                className=""
                onChange={(e) => setSecondName(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-between gap-6">
              <div className="">
                <Select
                  label="Select User"
                  className=""
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  {optionsUser.map((type) => {
                    return (
                      <Option onClick={() => setTypeUser(type)}>{type}</Option>
                    );
                  })}
                </Select>
              </div>
              <div className="">
                <Input
                  label={jobHandler(typeUser)}
                  className=""
                  onChange={(e) => setJob(e.target.value)}
                />
                {/* <Select
                  label="Select Issue title*"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
          
                >
                
                </Select> */}
              </div>
              <div className="">
                {/* <Select
                  label="Select Priority*"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
               
                >
                
                </Select> */}
              </div>
            </div>
            <Input
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </DialogBody>

        <DialogFooter className="flex flex-wrap gap-4 space-x-2">
          <Button variant="outlined" color="red" onClick={handleAddUser}>
            close
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              sentData();
            }}
          >
            Add User
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
    </div>
  );
};

export default AddUser;

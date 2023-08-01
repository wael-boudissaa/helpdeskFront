import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import AuthContext from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import SnackBar from "@/widgets/SnackBar";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const { loginUser, user, logoutUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [color, setColor] = useState("");

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    let user = { username: username, password: password };
    const loginResult = await loginUser(user);
    if (loginResult.success) {
      setSnackbarMessage("Successfully logged in!");
      setShowSnackbar(true);
      setColor("bg-green-300");
      const delayTime = 1000;
      await new Promise((resolve) => setTimeout(resolve, delayTime));
      navigate("/dashboard/home");
    } else {
      setSnackbarMessage(`${loginResult.error}`);
      setShowSnackbar(true);
      setColor("bg-red-300");
    }
  };

  useEffect(()=> {
    if (user) logoutUser();
  }, [])

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="text"
              label="username"
              size="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={handleSubmit} variant="gradient" fullWidth>
              Sign In
            </Button>
          </CardFooter>
        </Card>
        {showSnackbar && (
          <SnackBar
            color={color}
            snackbarMessage={snackbarMessage}
            closeSnackBar={handleSnackbarClose}
          />
        )}
      </div>
    </>
  );
}

export default SignIn;

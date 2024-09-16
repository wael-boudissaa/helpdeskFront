import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  // Progress,
  IconButton,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
// import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
// import { authorsTableData, projectsTableData } from "@/data";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { useMaterialTailwindController } from "@/context";
import {
  EnvelopeIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CheckIcon,
  PlusCircleIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";
import { RemoveTicket } from "@/widgets/pop-ups/RemoveTicket";
import { AddTickets } from "@/widgets/pop-ups/AddTickets";
import { ValidateTicket } from "@/widgets/pop-ups/ValidateTicket";
import SnackBar from "@/widgets/SnackBar";
import Discussion from "@/widgets/pop-ups/Discussion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";

export function Tables(props) {
  const [idTicketSupprime, setIdTicketSupprime] = useState("");
  const [idTicketValide, setIdTicketValide] = useState("");
  const [messages, setMessages] = useState([]);
  const [discussionTicketState, setDiscussionTicketState] = useState("");
  const [discussionTicketId, setDiscussionTicketId] = useState("");
  const selectedTable = props.selectedTable;
  const setHomeTickets = props.setHomeTickets;
  const { user, authTokens, logoutUser, updateToken } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filtredTickets, setFilteredTickets] = useState([]);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor } = controller;
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [color, setColor] = useState("");
  const [experts, setExperts] = useState([]);
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };
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
  const [open, setOpen] = useState(false);
  const [openDeleteSure, setOpenDeleteSure] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [openValidate, setOpenValidate] = useState(false);
  const handleOpenValidate = () => setOpenValidate(!openValidate);
  const [actionHappened, setActionHappened] = useState(false);
  const [refetchMsg, setRefetchMsg] = useState(false);
  const [refetchExperts, setRefetchExperts] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const handleAction = () => setActionHappened(!actionHappened);
  const handleOpenDeleteSure = () => setOpenDeleteSure(!openDeleteSure);
  const [openDiscussion, setOpenDiscussion] = useState(false);
  const handleOpenDiscussion = () => setOpenDiscussion(!openDiscussion);
  const typeUser = () => {
    if (user.type == "expert") {
      return "applicant";
    }
    return "expert";
  }; /* a table header */
  const DeleteTicket = async (deletedTicket) => {
    const authorization = "Bearer " + authTokens.access;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tickets/${deletedTicket}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authorization,
          },
        }
      );

      if (response.ok) {
        setActionHappened(!actionHappened);
        setSnackbarMessage("Successfully removed to archive!");
        setShowSnackbar(true);
        setColor("bg-green-300");
      } else if (response.status == 401) {
        const currentTime = Date.now() / 1000;
        const t = authTokens;
        const u = jwtDecode(t.refresh);
        if (u.exp < currentTime) {
          alert("Your session has expired, please log in again");
          logoutUser();
        } else {
          await updateToken();
          setSnackbarMessage("Operation failed, Try again");
          setShowSnackbar(true);
          setColor("bg-red-300");
        }
      }
    } catch (err) {
      console.log(err);
      setSnackbarMessage(err);
      setShowSnackbar(true);
      setColor("bg-red-300");
    }
  };

  const affectTicket = async (idTicket, expert_user_name) => {
    const authorization = "Bearer " + authTokens.access;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tickets/${idTicket}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify({
            expertId: expert_user_name,
          }),
        }
      );
      if (response.ok) {
        setActionHappened(!actionHappened);
        setSnackbarMessage("Successfully affected !");
        setShowSnackbar(true);
        setColor("bg-green-300");
      } else if (response.status == 401) {
        const currentTime = Date.now() / 1000;
        const t = authTokens;
        const u = jwtDecode(t.refresh);
        if (u.exp < currentTime) {
          alert("Your session has expired, please log in again");
          logoutUser();
        } else {
          await updateToken();
          setSnackbarMessage("Operation failed, Try again");
          setShowSnackbar(true);
          setColor("bg-red-300");
        }
      }
    } catch (err) {
      console.log(err);
      setSnackbarMessage(err);
      setShowSnackbar(true);
      setColor("bg-red-300");
    }
  };

  const validateTicket = async (idTicket) => {
    const authorization = "Bearer " + authTokens.access;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tickets/${idTicket}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        }
      );
      if (response.ok) {
        setActionHappened(!actionHappened);
        setSnackbarMessage("Successfully Validzated !");
        setShowSnackbar(true);
        setColor("bg-green-300");
      } else if (response.status == 401) {
        const currentTime = Date.now() / 1000;
        const t = authTokens;
        const u = jwtDecode(t.refresh);
        if (u.exp < currentTime) {
          alert("Your session has expired, please log in again");
          logoutUser();
        } else {
          await updateToken();
          setSnackbarMessage("Operation failed, Try again");
          setShowSnackbar(true);
          setColor("bg-red-300");
        }
      }
    } catch (err) {
      console.log(err);
      setSnackbarMessage(err);
      setShowSnackbar(true);
      setColor("bg-red-300");
    }
  };

  /* Refrech the messages in case of unauthorised response while fetching them */
  useEffect(() => {
    if (!initialRender) {
      fetchMessages(discussionTicketId);
    } else {
      setInitialRender(false);
    }
  }, [refetchMsg]);

  const fetchMessages = async (idTicket) => {
    try {
      const authorization = "Bearer " + authTokens.access;
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/${idTicket}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status == 401) {
        const currentTime = Date.now() / 1000;
        const t = authTokens;
        const u = jwtDecode(t.refresh);
        if (u.exp < currentTime) {
          alert("Your session has expired, please log in again");
          logoutUser();
        } else {
          const res = await updateToken();
          if (res) setRefetchMsg(!refetchMsg);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchExperts = async () => {
      const authorization = "Bearer " + authTokens.access;
      try {
        const response = await fetch("http://127.0.0.1:8000/api/experts/", {
          method: "GET",
          headers: {
            // 'Content-type' : "application/json",
            Authorization: authorization,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setExperts(data);
        } else if (response.status == 401) {
          const currentTime = Date.now() / 1000;
          const t = authTokens;
          const u = jwtDecode(t.refresh);
          if (u.exp < currentTime) {
            alert("Your session has expired, please log in again");
            logoutUser();
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user.type === "admin") {
      fetchExperts();
    }
  }, [refetchExperts]);
  /* Fetch the tickets */
  useEffect(() => {
    const fetchData = async () => {
      const authorization = "Bearer " + authTokens.access;
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      };
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/tickets",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
          setHomeTickets(data);
        } else if (response.status == 401) {
          const currentTime = Date.now() / 1000;
          const t = authTokens;
          const u = jwtDecode(t.refresh);
          if (u.exp < currentTime) {
            alert("Your session has expired, please log in again");
            logoutUser();
          } else {
            const res = await updateToken();
            if (res) {
              setActionHappened(!actionHappened);
              setRefetchExperts(!refetchExperts);
            }
          }
        } else {
          console.log("Failed to fetch");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [actionHappened]);

  /* Filter the brought tickets */
  useEffect(() => {
    let list = [];
    let condition = "";
    if (selectedTable === "Validated Tickets") condition = "validated";
    else if (selectedTable === "Waiting Tickets") condition = "waiting";
    else condition = "archived";
    for (let t of tickets) {
      if (t.etat === condition) list.push(t);
    }
    setFilteredTickets(list);
  }, [tickets, selectedTable]);

  const deleteNotifications = async (idTicket) => {
    const authorization = "Bearer " + authTokens.access;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/notifications/${idTicket}`,
        requestOptions
      );
      if (response.ok) {
        console.log("3maha wail");
        let list = [];
        for (let i of filtredTickets) {
          list.push(i);
          if (i.idTicket === idTicket) {
            i.newMessage = false;
          }
        }
        setFilteredTickets(list);
        console.log(list);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const colorOfPriority = (priority) => {
    if (priority == 1) return "bg-red-50";
    if (priority == 2) return "bg-yellow-50";
    if (priority == 3) return "bg-green-50";
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ToastContainer />
      <Card>
        <CardHeader
          variant="gradient"
          color={sidenavColor}
          className="mb-8 flex flex-row items-center justify-between p-6"
        >
          <Typography variant="h6" color="white">
            {selectedTable}
          </Typography>
          {user.type === "applicant" && selectedTable === "Waiting Tickets" && (
            <Tooltip
              content="Add a Ticket"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
            >
              <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
                <PlusCircleIcon className="h-7 w-7 text-white" />
              </IconButton>
            </Tooltip>
          )}
        </CardHeader>
        <CardBody className=" table_card overflow-x-scroll px-0 pt-0 pb-2">
          {user.type !== "admin" ? (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[typeUser(), "categorie", "issue", "Date", ""].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtredTickets.map(
                  (
                    {
                      username,
                      category,
                      issue,
                      etat,
                      creationDate,
                      jobtitle,
                      idTicket,
                      newMessage,
                      priority,
                    },
                    key
                  ) => {
                    const className = `py-3 px-5 ${
                      key === tickets.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr className={`${colorOfPriority(priority)}`}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-semibold ${
                                  username === "Ticket not Affected Yet" &&
                                  "text-red-500"
                                }`}
                              >
                                {username}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {jobtitle}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {category}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {issue}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {adjustDate(creationDate)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Tooltip
                            content="Check Discussion"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                          >
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => {
                                handleOpenDiscussion();
                                fetchMessages(idTicket);
                                setDiscussionTicketState(etat);
                                setDiscussionTicketId(idTicket);
                                if (newMessage) deleteNotifications(idTicket);
                              }}
                            >
                              {!newMessage ? (
                                <EnvelopeIcon className="h-5 w-5 text-blue-300" />
                              ) : (
                                <BellAlertIcon className="h-5 w-5 text-red-400" />
                              )}
                            </IconButton>
                          </Tooltip>
                          {user.type === "expert" && etat === "waiting" && (
                            <Tooltip
                              content="Validate The Ticket"
                              animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                              }}
                            >
                              <IconButton
                                onClick={() => {
                                  handleOpenValidate();
                                  setIdTicketValide(idTicket);
                                }}
                                variant="text"
                                color="blue-gray"
                              >
                                <CheckIcon className="h-5 w-5 text-green-300" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Expert",
                    "applicant",
                    "categorie",
                    "issue",
                    "Date",
                    "",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtredTickets.map(
                  (
                    {
                      idTicket,
                      username,
                      category,
                      issue,
                      etat,
                      creationDate,
                      jobtitle,
                      expertname,
                      expertjob,
                      priority,
                    },
                    key
                  ) => {
                    const className = `py-3 px-5 ${
                      key === tickets.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr className={`${colorOfPriority(priority)}`}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            {/* <Avatar src={img} alt={name} size="sm" /> */}
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-semibold ${
                                  expertname === "Ticket not Affected Yet" &&
                                  "text-red-500"
                                }`}
                              >
                                {expertname}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {expertjob}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {username}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {jobtitle}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {category}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {issue}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {adjustDate(creationDate)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Tooltip
                            content="Check Discussion"
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0, y: 25 },
                            }}
                          >
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => {
                                handleOpenDiscussion();
                                fetchMessages(idTicket);
                                setDiscussionTicketState(etat);
                                setDiscussionTicketId(idTicket);
                              }}
                            >
                              <EnvelopeIcon className="h-5 w-5 text-blue-300" />
                            </IconButton>
                          </Tooltip>

                          {user.type === "admin" && etat === "waiting" && (
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray">
                                  <PaperAirplaneIcon className="text-black-300 h-5 w-5" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="menu flex max-h-64 w-72 flex-col gap-2 overflow-auto">
                                {experts.map((expert) => {
                                  return (
                                    <MenuItem
                                      onClick={() => {
                                        affectTicket(idTicket, expert.username);
                                      }}
                                      className="flex items-center gap-4 py-2 pr-8 pl-2"
                                    >
                                      <Avatar
                                        size="sm"
                                        variant="circular"
                                        alt="tania andrew"
                                        src="/img/user.svg"
                                      />
                                      <div className="flex flex-col gap-1">
                                        <Typography
                                          variant="small"
                                          color="gray"
                                          className="font-normal"
                                        >
                                          <p className="font-medium text-blue-gray-900">
                                            {expert.first_name + " "}
                                            {expert.last_name}
                                          </p>
                                          {expert.domaine_expertise}
                                        </Typography>
                                      </div>
                                    </MenuItem>
                                  );
                                })}
                              </MenuList>
                            </Menu>
                          )}
                          {user.type === "admin" && etat !== "archived" && (
                            <Tooltip
                              content="Remove to Archive"
                              animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                              }}
                            >
                              <IconButton
                                onClick={() => {
                                  handleOpenDeleteSure();
                                  setIdTicketSupprime(idTicket);
                                }}
                                variant="text"
                                color="blue-gray"
                              >
                                <TrashIcon className="h-5 w-5 text-red-300" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
      <AddTickets
        open={open}
        handleOpen={handleOpen}
        handleAction={handleAction}
      />
      <Discussion
        open={openDiscussion}
        handleOpen={handleOpenDiscussion}
        messages={messages}
        discussionTicketState={discussionTicketState}
        discussionTicketId={discussionTicketId}
        refreshMessages={fetchMessages}
      />
      <RemoveTicket
        openDeleteSure={openDeleteSure}
        handleOpenDeleteSure={handleOpenDeleteSure}
        DeleteTicket={DeleteTicket}
        idTicketSupprime={idTicketSupprime}
      />
      {showSnackbar && (
        <SnackBar
          color={color}
          snackbarMessage={snackbarMessage}
          closeSnackBar={handleSnackbarClose}
        />
      )}
      <ValidateTicket
        openValidate={openValidate}
        handleOpenValidate={handleOpenValidate}
        validateTicket={validateTicket}
        idTicket={idTicketValide}
      />
    </div>
  );
}

export default Tables;

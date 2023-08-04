import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Progress,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { useMaterialTailwindController } from "@/context";
import {
  EnvelopeIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CheckIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { AddTickets } from "@/widgets/pop-ups/AddTickets";

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-3 w-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function Tables(props) {
  const selectedTable = props.selectedTable;
  const setHomeTickets = props.setHomeTickets;
  const { user, authTokens } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filtredTickets, setFilteredTickets] = useState([]);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor } = controller;
  const experts = [
    {
      first_name: "Boudissa",
      second_name: "Wael",
      domaine_expertise: "IT support",
    },
    {
      first_name: "Dupont",
      second_name: "Sophie",
      domaine_expertise: "Marketing",
    },
    {
      first_name: "Lefebvre",
      second_name: "Pierre",
      domaine_expertise: "Finance",
    },
    {
      first_name: "Martin",
      second_name: "Julie",
      domaine_expertise: "Human Resources",
    },
  ];
  const typeUser = () => {
    if (user.type == "expert") {
      return "applicant";
    }
    return "expert";
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  
  const adjustDate = (isoDate) =>{
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      timeZoneName: 'short' 
    };
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', options);
  }

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
        } else {
          console.log("Failed to fetch");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [authTokens, open]);

  useEffect(() => {
    let list = [];
    let condition = "";
    console.log(tickets);
    if (selectedTable === "Validated Tickets") condition = "validated";
    else if (selectedTable === "Waiting Tickets") condition = "waiting";
    else condition = "archived";
    for (let t of tickets) {
      if (t.etat === condition) list.push(t);
    }
    setFilteredTickets(list);
  }, [tickets, selectedTable]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color={sidenavColor}
          className="mb-8 flex flex-row justify-between p-6"
        >
          <Typography variant="h6" color="white">
            {selectedTable}
          </Typography>
          {user.type === "applicant" && selectedTable === "Waiting Tickets" && (
            <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
              <PlusCircleIcon className="h-7 w-7 text-white" />
            </IconButton>
          )}
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
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
                    { username, category, issue, creationDate, jobtitle },
                    key
                  ) => {
                    const className = `py-3 px-5 ${
                      key === tickets.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr>
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
                          <IconButton variant="text" color="blue-gray">
                            <EnvelopeIcon className="h-5 w-5 text-blue-300" />
                          </IconButton>
                          {user.type === "expert" && (
                            <IconButton variant="text" color="blue-gray">
                              <CheckIcon className="h-5 w-5 text-green-300" />
                            </IconButton>
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
                      username,
                      category,
                      issue,
                      etat,
                      creationDate,
                      jobtitle,
                      expertname,
                      expertjob,
                    },
                    key
                  ) => {
                    const className = `py-3 px-5 ${
                      key === tickets.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr >
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            {/* <Avatar src={img} alt={name} size="sm" /> */}
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
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
                            <IconButton variant="text" color="blue-gray">
                              <EnvelopeIcon className="h-5 w-5 text-blue-300" />
                            </IconButton>
                          </Tooltip>

                          {((user.type === "admin") && (expertname === "Ticket not Affected Yet") &&(etat !=="archived")) && (
                            <Menu>
                              <MenuHandler>
                                {/* <Tooltip
                                  content="Transfert to Expert"
                                  animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                  }}
                                > */}
                                <IconButton variant="text" color="blue-gray">
                                  <PaperAirplaneIcon className="text-black-300 h-5 w-5" />
                                </IconButton>
                                {/* </Tooltip> */}
                              </MenuHandler>
                              <MenuList className="menu flex max-h-64 w-72 flex-col gap-2 overflow-auto">
                                {experts.map((expert) => {
                                  return (
                                    <MenuItem className="flex items-center gap-4 py-2 pr-8 pl-2">
                                      <Avatar
                                        size="sm"
                                        variant="circular"
                                        alt="tania andrew"
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg"
                                      />
                                      <div className="flex flex-col gap-1">
                                        <Typography
                                          variant="small"
                                          color="gray"
                                          className="font-normal"
                                        >
                                          <p className="font-medium text-blue-gray-900">
                                            {expert.first_name} {" "} {expert.second_name}
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
                          {((user.type === "admin")&&(etat !=="archived")) && (
                            <Tooltip
                              content="Remove to Archive"
                              animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                              }}
                            >
                              <IconButton variant="text" color="blue-gray">
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
      <AddTickets open={open} handleOpen={handleOpen} />
    </div>
  );
}

export default Tables;

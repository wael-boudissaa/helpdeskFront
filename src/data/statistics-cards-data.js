import {
  ClockIcon,
  CheckIcon,
  TrashIcon
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "green",
    icon: CheckIcon,
    title: "Validated Tickets",
    //value: "25", // to remove -- dynamic 
    footer: {
      color: "text-green-500",
      //value: "55%", // to remove -- dynamyc
      label: "Of the total",
    },
  },
  {
    color: "pink",
    icon: ClockIcon,
    title: "Waiting Tickets",
    //value: "40", // to remove -- dynamic 
    footer: {
      color: "text-green-500",
      //value: "3%", // to remove -- dynamic 
      label: "Of the total",
    },
  },
  {
    color: "red",
    icon: TrashIcon,
    title: "Archived Tickets",
    //value: "40", // to remove -- dynamic 
    footer: {
      color: "text-green-500",
      //value: "3%", // to remove -- dynamic 
      label: "Of the total",
    },
  },
];

export default statisticsCardsData;

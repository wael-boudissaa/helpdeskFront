import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import AuthContext from "@/context/AuthContext";

export function AddTickets({ open, handleOpen }) {
  const { user } = useContext(AuthContext);

  const versionOptions = ["Application", "IT assistance", "Hardware"];

  const dynamicOptions = {
    "Application": [
      "Installation des logiciels",
      "Installations des systemes",
      "Maintenance des ERPs",
    ],
    "IT assistance": [
      "License d'activation",
      "Création d'un compte MS teams",
      "Creation d'une bote mail",
      "Acces aux ressources partagées ",
      "Acces au Wi-Fi",
      "Acces au Internet",
    ],
    "Hardware": [
      "Installation d'une telephone/Deck",
      "Installation d'une imprimente réseau",
      "Changement de toner/cartouches/papier",
      "Installation d'un ecran supplementaire ",
      "Mantenance de PC/Laptops",
      "Maintenance du System TV",
    ],
  };
  const [selectedVersionOptions, setSelectedVersionOptions] = useState(
    dynamicOptions["Application"]
  );

  return (
    <>
      <Dialog open={open} handler={handleOpen} className="overflow-auto">
        <div className="flex items-center justify-between">
          <DialogHeader>New Ticket</DialogHeader>
        </div>
        <DialogBody divider>
          <div className="grid gap-6 w-full">
            <Input label="Username" value={user.username} readOnly />
            <div className="flex flex-wrap gap-6">
              <div className="">
                <Select
                  label="Select Version"
                  
                  onChange={(value) => {
                    setSelectedVersionOptions(dynamicOptions[value]);
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
                  label="Select Version"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  {selectedVersionOptions?.map((version) => {
                    return <Option>{version}</Option>;
                  })}
                </Select>
              </div>
            </div>
            <Textarea maxLength={800} label="Message" />
          </div>
        </DialogBody>

        <DialogFooter className="space-x-2 flex flex-wrap gap-4">
          <Button variant="outlined" color="red" onClick={handleOpen}>
            close
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            send message
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

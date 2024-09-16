import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
 
export function ValidateTicket({openValidate, handleOpenValidate, validateTicket, idTicket}) {
 
  return (
    <>
      <Dialog
        open={openValidate}
        size={"xs"}
        handler={handleOpenValidate}
      >
        <DialogHeader>Confirm the Validation</DialogHeader>
        <DialogBody divider>
          Are you sure you want to validate the ticket !
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenValidate}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              handleOpenValidate();
              validateTicket(idTicket);
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
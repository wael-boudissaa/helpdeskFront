import React from "react";
import { AiFillCloseCircle } from "react-icons/ai"

function SnackBar(props) {
  return (
    <div
      className={`fixed bottom-[100px] right-2 lg:right-10 ${props.color} flex flex-row items-center gap-3 rounded-md p-4 shadow-md`}
    >
      <div>{props.snackbarMessage}</div>
      <button onClick={props.closeSnackBar}>
        <AiFillCloseCircle />
      </button>
    </div>
  );
}

export default SnackBar;

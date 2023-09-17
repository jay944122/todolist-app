import React, { useEffect, useRef } from "react";
import Classes from "./AddTask.module.css";

const AddTask = (props) => {
  const title = useRef();

  useEffect(() => {
    title.current.value = props.isEdit.edit ? props.isEdit.task.title : "";
  }, [props.isEdit]);

  return (
    <div className={Classes.taskContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.addtask(title.current.value);
          title.current.value = "";
        }}
      >
        <div className={Classes.insideBox}>
          <label>Enter the task</label>
          <br />
          <input ref={title} type="text" required />
        </div>
        <div>
          {props.isEdit.edit ? (
            <button
              type="button"
              onClick={() => {
                const task = props.isEdit.task;
                task.title = title.current.value;
                props.updateHandler(task, false);
              }}
              className={Classes.saveButton}
            >
              Save
            </button>
          ) : (
            <button type="submit" className={Classes.addButton}>
              ADD TASK
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTask;

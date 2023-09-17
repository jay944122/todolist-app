import React, { useEffect, useState, useMemo } from "react";
import { Store } from "react-notifications-component";

import {
  addTaskHandler,
  deleteTask,
  fetchTodo,
  updateTask,
} from "../../api/index.js";
import AddTask from "../addTask/AddTask";
import Spinner from "../spinner/Spinner";
import ShowTask from "../showTask/ShowTask";
import Classes from "./TodoContainer.module.css";
import "react-notifications-component/dist/theme.css";

const TodoContainer = () => {
  const [isLoading, setisLoading] = useState(true);
  const [Todo, setTodo] = useState([]);
  const [isEdit, setisEdit] = useState({
    edit: false,
    task: {},
  });
  const userId = 1;

  const notifications = useMemo(() => {
    return {
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 1000,
        onScreen: true,
      },
    };
  }, []);

  async function completed(task) {
    const index = Todo.findIndex((elm) => {
      return elm.id === task.id;
    });
    setTodo((prev) => {
      prev[index].completed = true;
      return [...prev];
    });

    Store.addNotification({
      title: "Congratulations",
      message: "Task Completed Successfully",
      type: "success",
      ...notifications,
    });
  }

  async function updateHandler(task, requested) {
    if (requested) {
      setisEdit({
        edit: true,
        task,
      });
      return;
    }

    Store.addNotification({
      title: "In Progress",
      message: "Updating Data",
      type: "info",
      ...notifications,
    });

    const data = await updateTask(task);

    if (data.success) {
      Store.addNotification({
        title: "Success",
        message: "Task Updated Successfully",
        type: "success",
        ...notifications,
      });
    } else {
      Store.addNotification({
        title: "Oh No!",
        message: data.message,
        type: "error",
        ...notifications,
      });
    }

    setisEdit({
      edit: false,
      task: {},
    });
  }

  async function deleteHandler(id) {
    Store.addNotification({
      title: "In Progress",
      message: "Deleting Data",
      type: "info",
      ...notifications,
    });

    const result = await deleteTask(id);

    if (result.success) {
      const updatedTodo = Todo.filter((data) => {
        return data.id !== id;
      });

      setTodo(updatedTodo);

      Store.addNotification({
        title: "Success",
        message: "Task Deleted Successfully",
        type: "success",
        ...notifications,
      });
    } else {
      Store.addNotification({
        title: "Oops!",
        message: result.message,
        type: "error",
        ...notifications,
      });
    }
  }

  async function addData(title) {
    Store.addNotification({
      title: "In Progress",
      message: "Adding Data",
      type: "info",
      ...notifications,
    });

    const data = await addTaskHandler(title, userId);

    if (data.success) {
      Store.addNotification({
        title: "Success",
        message: "Task Added Successfully",
        type: "success",
        ...notifications,
      });

      setTodo([data.data, ...Todo]);
    } else {
      Store.addNotification({
        title: "Oops!",
        message: data.message,
        type: "error",
        ...notifications,
      });
    }
  }

  useEffect(() => {
    async function fetchData() {
      Store.addNotification({
        title: "In Progress",
        message: "Fetching Data",
        type: "info",
        ...notifications,
      });

      const data = await fetchTodo();

      if (data.success) {
        setisLoading(false);
        setTodo(data.data);
      } else {
        setisLoading(false);
        Store.addNotification({
          title: "Oops!",
          message: data.message,
          type: "error",
          ...notifications,
        });
      }
    }

    fetchData();
  }, [notifications]);

  return (
    <div className={Classes.container}>
      <h1>Todo App</h1>
      <AddTask addtask={addData} isEdit={isEdit} updateHandler={updateHandler} />
      {isLoading ? (
        <Spinner />
      ) : (
        <ShowTask
          todo={Todo}
          delete={deleteHandler}
          completed={completed}
          updateHandler={updateHandler}
        />
      )}
    </div>
  );
};

export default TodoContainer;

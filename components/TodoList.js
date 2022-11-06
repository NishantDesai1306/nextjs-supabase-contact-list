import { useState, useContext } from "react";
import { Button } from "@supabase/ui";
import { TodoApiContext } from "../api/todo";
import Loader from "./Loader";

export default function Todos() {
  const { isLoading, todos, createTodo, deleteTodo } =
    useContext(TodoApiContext);

  const [newTaskText, setNewTaskText] = useState("");
  const [errorText, setError] = useState("");

  const addTodo = async (taskText) => {
    await createTodo.mutate(taskText);
    setNewTaskText("");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="mb-4">Todo List.</h1>
        </div>

        {
          isLoading && (
            <div>
              <Loader />
            </div>
          )
        }
      </div>
      <div className="flex gap-2 my-2">
        <form
          className="w-full flex"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            addTodo(newTaskText);
          }}
        >
          <input
            className="rounded w-full p-2 mr-2 outline-emerald-500"
            type="text"
            placeholder="make coffee"
            value={newTaskText}
            onChange={(e) => {
              setError("");
              setNewTaskText(e.target.value);
            }}
          />
          <Button onClick={() => addTodo(newTaskText)}>Add</Button>
        </form>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              onDelete={() => deleteTodo.mutate(todo.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Todo = ({ todo, onDelete }) => {
  const { updateTodo } = useContext(TodoApiContext);

  const toggle = async () => {
    updateTodo.mutate({
      ...todo,
      is_completed: !todo.is_completed,
    });
  };

  return (
    <li
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out"
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="text-sm leading-5 font-medium truncate">
            {todo.task}
          </div>
        </div>
        <div>
          <input
            className="cursor-pointer"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={todo.is_completed ? true : ""}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

const Alert = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);

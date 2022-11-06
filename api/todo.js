import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";

export const TodoApiContext = React.createContext({});

export default function TodoApiProvider({ children }) {
  const { supabaseClient: supabase } = useSessionContext();
  const user = useUser();
  const queryClient = useQueryClient();

  const getTodosAPI = useCallback(async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", true);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return todos;
  }, [ supabase ]);

  const createTodoAPI = useCallback(async (taskText) => {
    let task = taskText.trim();

    if (task.length) {
      let { data: todo, error } = await supabase
        .from("todos")
        .insert({ task, user_id: user.id })
        .single();

      if (error) {
        if (error) {
          console.log(error);
          throw new Error(error.message);
        }
      }

      return todo;
    }
  }, [ supabase ]);

  const updateTodoAPI = useCallback(async (todo) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ ...todo })
      .eq("id", todo.id)
      .single();

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return data;
  }, [ supabase ]);

  const deleteTodoAPI = useCallback(async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return id;
  }, [ supabase ]);

  const { data, isFetching } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodosAPI,
  });

  const createTodo = useMutation({
    mutationFn: createTodoAPI,
    onSuccess: (data) => {
      console.log("create todo on success", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodo = useMutation({
    mutationFn: updateTodoAPI,
    onSuccess: (data) => {
      console.log("update todo on success", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: deleteTodoAPI,
    onSuccess: (data) => {
      console.log("delete todo on success", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <TodoApiContext.Provider
      value={{
        todos: data ?? [],
        isLoading: isFetching,
        createTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoApiContext.Provider>
  );
}

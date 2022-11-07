import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import TodoList from "../components/TodoList";
import Navbar from "../components/Navbar";
import TodoApiProvider from "../api/todo";

export default function TodoPage() {
  return (
    <TodoApiProvider>
      <div className="w-full h-full bg-gray-300">
        <Navbar />
        <div
          className="w-full h-full flex flex-col justify-center items-center p-4"
          style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
        >
          <TodoList />
        </div>
      </div>
    </TodoApiProvider>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  cookieOptions: {
    name: process.env.NEXT_PUBLIC_COOKIE_NAME,
  },
});

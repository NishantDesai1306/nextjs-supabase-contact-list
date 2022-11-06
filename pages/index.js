import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";

export default function IndexPage() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    router.push({
      pathname: "/login",
    });
  }, [user]);

  return (
    <div className="w-full h-full bg-gray-300 flex justify-center items-center">
      <h1>Loading...</h1>
    </div>
  );
}

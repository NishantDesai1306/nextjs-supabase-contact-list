import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";

export default function LoginPage() {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const user = useUser();
  
  useEffect(() => {
    if (user) {
      router.push({
        pathname: "/todo",
      });
    }
  }, [user]);
  
  if (!supabaseClient) {
    return <div>supabase client is not working</div>
  }

  return (
    <div className="w-full h-full bg-gray-300">
      <div className="w-full h-full flex justify-center items-center p-4">
        <div class="card flex flex-col justify-center p-10 bg-white rounded-lg shadow-2xl">
          <div className="text-center text-4xl mb-8">
            Authentication
          </div>
          <Auth
            redirectTo="http://localhost:3000"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandButtonText: 'white',
                    brandAccent: '#15803d',
                  },
                },
              },
            }}
            supabaseClient={supabaseClient}
            socialLayout="horizontal"
          />
        </div>
      </div>
    </div>
  );
}

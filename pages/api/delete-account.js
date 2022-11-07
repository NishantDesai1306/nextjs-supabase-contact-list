import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { deleteCookie } from "cookies-next";

export default async function handler(req, res) {
  const userSupabaseClient = createServerSupabaseClient({ req, res }, {
    cookieOptions: {
      name: process.env.NEXT_PUBLIC_COOKIE_NAME,
    }
  });
  const {
    data: { session },
  } = await userSupabaseClient.auth.getSession();

  if (!session)
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });

  // Run queries with RLS on the server
  const { data: deletedTodos, error: todoError } = await userSupabaseClient
    .from("todos")
    .delete()
    .eq("user_id", session.user.id)
    .select("*");
  const { data: deletedContacts, error: contactError } =
    await userSupabaseClient
      .from("contacts")
      .delete()
      .eq("user_id", session.user.id)
      .select("*");

  // delete user account
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABSE_SERIVCE_ROLE_KEY
  );

  for (const contact of deletedContacts) {
    if (contact.picture) {
      const { data, error } = await userSupabaseClient.storage
        .from("profile")
        .remove([contact.picture]);
      console.log(contact, data, error);
    }
  }

  const { data: user, error } = await supabaseClient.auth.admin.deleteUser(
    session.user.id
  );

  if (error) {
    console.log(error);
  } else {
    deleteCookie(process.env.NEXT_PUBLIC_COOKIE_NAME, { req, res });
  }

  res.json({
    todos: deletedTodos,
    contacts: deletedContacts,
    user,
  });
}

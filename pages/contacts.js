import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import React from "react";
import ContactsApiProvider from "../api/contacts";
import ContactList from "../components/contacts/ContactList";
import Navbar from "../components/Navbar";

export default function ContactsPage() {
  return (
    <ContactsApiProvider>
      <div className="w-full h-full bg-gray-300 flex flex-col">
        <Navbar />

        <div
          className="w-full flex-grow flex flex-col items-center p-4 mt-16 mx-auto"
          style={{ minWidth: 250, maxWidth: 600 }}
        >
          <ContactList />
        </div>
      </div>
    </ContactsApiProvider>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
});

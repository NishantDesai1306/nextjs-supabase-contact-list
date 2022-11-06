import { useState, useContext, useCallback } from "react";
import { Button } from "@supabase/ui";
import Loader from "../Loader";
import { ContactsApiContext } from "../../api/contacts";
import CreateContactModal from "./CreateContactModal";
import UpdateContactModal from "./UpdateContactModal";
import ProfilePicture from "./ProfilePicture";

export default function Contacts() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [contactToUpdate, setContactToUpdate] = useState(null);
  const { isLoading, contacts, createContact, updateContact, deleteContact } =
    useContext(ContactsApiContext);

  const addContact = useCallback(async (contact) => {
    await createContact.mutate(contact);
    setShowCreateModal(false);
  }, [createContact]);

  const updateContactFn = useCallback(async (contact) => {
    await updateContact.mutate(contact);
    setContactToUpdate(null);
  }, [updateContact]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="mb-4">Contacts List.</h1>
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
        <Button block onClick={() => setShowCreateModal(true)}>Add</Button>
      </div>

      <CreateContactModal 
        visible={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onConfirm={addContact}
      />

      <UpdateContactModal
        contact={contactToUpdate}
        onHide={() => setContactToUpdate(null)}
        onConfirm={updateContactFn}
      />
      
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {contacts.map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              onUpdate={() => setContactToUpdate(contact)}
              onDelete={() => deleteContact.mutate(contact.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Contact = ({ contact, onDelete, onUpdate }) => {
  return (
    <li
      className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out"
      onClick={onUpdate}
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="mr-4">
          <ProfilePicture contact={contact} />
        </div>
        <div className="min-w-0 flex-1 flex-col flex items-start justify-center">
          <div className="text-lg leading-5 font-medium truncate">
            {contact.name}
          </div>
          <div className="text-sm text-gray-500 leading-5 font-medium truncate">
            {contact.phone}
          </div>
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

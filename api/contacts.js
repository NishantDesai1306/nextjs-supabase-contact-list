import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";

export const ContactsApiContext = React.createContext({});

export default function ContactsApiProvider({ children }) {
  const { supabaseClient: supabase } = useSessionContext();
  const user = useUser();
  const queryClient = useQueryClient();

  const getContactsAPI = useCallback(async () => {
    let { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .order("id", true);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return contacts;
  }, [ supabase ]);

  const updateContactPicture = useCallback(async (contact, imageFile) => {
    const extension = imageFile.name.split('.').pop();
    const fileName = `${contact.id}.${extension}`;

    const { data, error } = await supabase
      .storage
      .from('profile')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    // if existing image was different then remove it
    if (contact.picture !== fileName) {
      debugger;
      const { error: removeError } = await supabase
        .storage
        .from('profile')
        .remove([`/${contact.picture}`]);

      if (removeError) {
        console.log(removeError);
      }
    }

    contact.picture = data.path;

    return contact;
  }, [supabase]);

  const updateContactAPI = useCallback(async (contact) => {
    const keysToTrim = [
      'phone',
      'name',
      'email',
      'job_title',
      'company',
      'address',
    ];

    keysToTrim.forEach((key) => {
      contact[key].trim();
    });

    if (contact.picture && contact.picture instanceof File) {
      contact = await updateContactPicture(contact, contact.picture);
    }

    const { data, error } = await supabase
      .from("contacts")
      .update({ ...contact, updated_at: new Date() })
      .eq("id", contact.id)
      .select("*")
      .single();

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return data;
  }, [ supabase, updateContactPicture ]);

  const createContactAPI = useCallback(async (contact) => {
    const keysToTrim = [
      'phone',
      'name',
      'email',
      'job_title',
      'company',
      'address',
    ];

    keysToTrim.forEach((key) => {
      contact[key].trim();
    });

    let { data: createdContact, error } = await supabase
      .from("contacts")
      .insert({
        ...contact,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
    
        // dont save picture yet as we dont have id of contact
        picture: null,
      })
      .select('*')
      .single();

    if (error) {
      console.log(error);
      throw new Error(error.message);
    } 
    
    if (contact.picture && contact.picture instanceof File) {
      createdContact.picture = contact.picture;

      // this will upload the picture and update contact in database
      debugger;
      const finalContact = await updateContactAPI(createdContact);

      debugger;
      return finalContact;
    }

    return createdContact;
  }, [supabase, updateContactAPI]);

  const deleteContactAPI = useCallback(async (id) => {
    const { data, error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .select("*");

    // delete image if it exists
    if (data && data[0].picture) {
      const { error: removeError } = await supabase
        .storage
        .from('profile')
        .remove([`/${data[0].picture}`]);

      if (removeError) {
        console.log(removeError);
      }
    }

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return id;
  }, [ supabase ]);

  const { data, isFetching } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContactsAPI,
  });

  const createContact = useMutation({
    mutationFn: createContactAPI,
    onSuccess: (data) => {
      console.log("create contact on success", data);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const updateContact = useMutation({
    mutationFn: updateContactAPI,
    onSuccess: (data) => {
      console.log("update contact on success", data);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const deleteContact = useMutation({
    mutationFn: deleteContactAPI,
    onSuccess: (data) => {
      console.log("delete contact on success", data);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return (
    <ContactsApiContext.Provider
      value={{
        contacts: data ?? [],
        isLoading: isFetching,
        createContact,
        updateContact,
        deleteContact,
      }}
    >
      {children}
    </ContactsApiContext.Provider>
  );
}

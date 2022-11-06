import React, { useEffect, useState } from "react";
import { IconUser } from "@supabase/ui";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function ProfilePicture ({ contact }) {
  const [publicUrl, setPublicUrl] = useState(null);
  const { supabaseClient: supabase } = useSessionContext();

  useEffect(() => {
    if (contact.picture) {
      const { data } = supabase
        .storage
        .from('profile')
        .getPublicUrl(contact.picture)
        
      setPublicUrl(data.publicUrl);
    }
  }, [ contact, supabase ]);

  if (publicUrl) {
    return (
      <img
        className="h-8 w-8 rounded-full"
        src={publicUrl}
        alt={contact.name}
      />
    );
  }

  return (
    <IconUser />
  )
}
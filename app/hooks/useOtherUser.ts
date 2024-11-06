import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

//we using users as optional because we can use this hook for a group conversation too.
const useOtherUser = (conversation: FullConversationType | {
  users: User[]
}) =>{

  // we're trying to get the other user in the conversation so we can use their information
  const session = useSession();

  const otherUser = useMemo(()=>{
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversation.users.filter((user)=> user.email !== currentUserEmail);
    return otherUser[0];
  }, [session?.data?.user?.email, conversation.users]);


  return otherUser;
}


export default useOtherUser;
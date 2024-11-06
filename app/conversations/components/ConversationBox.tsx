"use client"

import React from 'react'
import { useCallback, useMemo } from 'react';
import { Conversation, Message, User } from '@prisma/client';
import {format} from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import { useRouter } from 'next/navigation';
import Avatar from '@/app/components/Avatar';

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean;
}


const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected
}) => {

  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(()=>{
    router.push(`/conversations/${data.id}`);
  },[router, data.id]);

  // we need to memoize the last message because we're using it across our other variable in this component
  const lastMessage = useMemo(()=>{
    const messages = data.messages || [];

    return messages[messages.length - 1];
  },[data.messages]);


  // we need to memoize the user email because we're using it across our other variable in this component
  const userEmail = useMemo(()=>{
    return session.data?.user?.email;
  },[session.data?.user?.email]);

  // create a control wether the user has seen the last message or not
  const hasSeen = useMemo(()=>{

    if(!lastMessage){
      return false;
    }

    // we use an empty array as a fallback if the seen property is not available so we dont break the app
    const seen = lastMessage?.seen || [];

    if(!userEmail){
      return false;
    }
    return seen.filter((user)=> user.email === userEmail).length !== 0;
  },[lastMessage, userEmail]);


  const lastMessageText = useMemo(()=>{
    if(lastMessage?.image){
      return 'Sent an Image 📷';
    }

    if(lastMessage?.body){
      return lastMessage.body;
    }

    return 'Started a conversation'
  }, [lastMessage])

  return (
    <div onClick={handleClick} className={
      clsx(`
        w-full
        relative
        flex
        items-center
        
        space-x-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        p-3
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )
    }>
      <Avatar user={otherUser}/>
      <div className='min-w-0 flex-1'> 
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p>{data.name || otherUser.name}</p>
            
              {lastMessage?.createdAt && (
                <p className='text-xs text-gray-400 font-light'>
                  {format(new Date(lastMessage.createdAt), 'p')}
                </p>

              )}
           
          </div>
          <p className={
            clsx(
              `truncate
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )
          }>
            {lastMessageText}
          </p>

        </div>

      </div>
    </div>
  )
}

export default ConversationBox
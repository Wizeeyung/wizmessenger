"use client"

import useConversation from '@/app/hooks/useConversations'
import axios from 'axios';
import React from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

const Form = () => {

  const {conversationId} = useConversation();

  const{register,
    handleSubmit,
    setValue,
    formState:{
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues:{
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) =>{
    axios.post('/api/messages',{
      ...data,
      conversationId

    })
  }




  return (
    <div className=''>Form</div>
  )
}

export default Form
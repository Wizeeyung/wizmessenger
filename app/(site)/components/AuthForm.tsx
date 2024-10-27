"use client"

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

type Variant = "LOGIN" | "REGISTER"

const AuthForm = () => {


  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(()=>{
    if(variant === 'LOGIN'){
      setVariant('REGISTER')
    }else{
      setVariant('LOGIN')
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState:{
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      username: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) =>{

    setIsLoading(true);

    if(variant === 'REGISTER'){
      //Axios register
    }

    if(variant === 'LOGIN'){
      //Axios login
    }

  }


  const socialAction = (action: string) =>{
    setIsLoading(true);

    //Next auth Social sign in
  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <>
            <Input 
            label='Name'
            id='name'
            type='name'
            placeholder='wiz pro'
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Input 
            label='Email'
            id='email'
            type='email'
            placeholder='wiz@gmail.com'
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Input 
            label='Password'
            id='password'
            type='password'
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          </>
          )}


          {variant === 'LOGIN' && (
            <>
            <Input 
              label='Email'
              id='email'
              type='email'
              placeholder='wiz@gmail.com'
              register={register}
              errors={errors}
              disabled={isLoading}
            />

            <Input 
              label='Password'
              id='password'
              type='password'
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          </>
          )}


          <Button 
            type='submit'
            fullWidth
            disabled={isLoading}
          >
           {variant === "LOGIN" ? "Sign in" : "Register"}
          </Button>
          
        </form>

        {/* social login */}
        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'/>
              
            </div>

            <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Or continue with
                </span>
            </div>
          </div>

          <div className='mt-6 flex gap-2'>

          </div>

        </div>
      </div>
    </div>
  )
}

export default AuthForm
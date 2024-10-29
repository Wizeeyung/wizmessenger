"use client"

import axios from 'axios';
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


type Variant = "LOGIN" | "REGISTER"

const AuthForm = () => {

  const session = useSession()
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  useEffect(()=>{
    if(session?.status === 'authenticated'){
      router.push('/users')
    }
  },[session?.status])

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
    reset,
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
      axios.post('/api/register', data)
      .then(()=>{ 
        toast.success('Account created successfully')
        reset()
        setVariant('LOGIN')
      }) // Display success message
      .catch((error: any)=> 
        {
          const message = error.response?.data?.error || 'An error occurred';
          toast.error(message); 
        })// Display the error from backend))
      .finally(()=> setIsLoading(false))
      
    }

    if(variant === 'LOGIN'){
      //Axios login
      signIn('credentials',{
        ...data,
        redirect: false
      }).then((callback)=>{
        if(callback?.error){
          toast.error('Invalid credentials')
        }

        if(callback?.ok && !callback?.error){
          toast.success('Logged in successfully')
          reset()
          router.push('/users')
        }

        
        
      })
      .finally(()=>setIsLoading(false))
    }

  }


  const socialAction = (action: string) =>{
    setIsLoading(true);

    //Next auth Social sign in
    signIn(action, {
      redirect: false
    }).then((callback)=>{
      if(callback?.error){
        toast.error('An error occurred')
      }

      if(callback?.ok && !callback?.error){
        toast.success('Logged in successfully')
      }

    }).finally(()=>setIsLoading(false))
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

          {/* social buttons */}
          <div className='mt-6 flex flex-col gap-2'>
            <AuthSocialButton 
              icon={BsGithub}
              label='Github'
              onClick={()=>socialAction('github')}
            />

            <AuthSocialButton 
              icon={BsGoogle}
              label='Google'
              onClick={()=>socialAction('google')}
            />
          </div>

          <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
            <div>
              {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
            </div>
            <div onClick={toggleVariant} className='underline cursor-pointer'>
              {variant === 'LOGIN'? 'Create an account' : 'Login'}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AuthForm
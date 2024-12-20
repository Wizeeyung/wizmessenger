import bcrypt from 'bcrypt';

import prisma from '@/app/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request
){

  try{
    const body = await request.json();

  const {email, password, name} = body;

  if(!email || !password || !name){
    return new NextResponse('Missing info, please fill all fields', {status:400});
  }

  const hashedPassword = await bcrypt.hash(password,12);

  const user = await prisma.user.create({
    data:{
      email,
      name,
      hashedPassword
    }
  })

  return  NextResponse.json(user)
}catch(error:any){
  console.error(error, 'REGISTRATION_ERROR');
  return new NextResponse('Internal Server Error', {status:500});
}
}
  
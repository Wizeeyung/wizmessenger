import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/lib/prismadb';


export async function POST (request: Request){
  try{
    const currentUser = await getCurrentUser();
    const body = await request.json();

    //if we chatting with a single user we need just the userId, otherwise if its a group we need all the features in the body
    const {userId, isGroup, members,name} = body;

    if(!currentUser?.id || !currentUser?.email){
      return new NextResponse("unauthorized", {status: 401})
    }

    if(isGroup && (!members || members.length < 2 || !name)){
      return new NextResponse("Invalid data", {status: 400})
    }

    if(isGroup){
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users:{
            connect: [
              ...members.map((member: {value: string})=> ({
                id: member.value
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        include:{
          users: true
        }
      });

      return NextResponse.json(newConversation, {status: 200})
    }

    //so we wont create a new array of conversation when you send a new message
    const existingConversations = await prisma.conversation.findMany({
      where:{
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    });

    const singleConversation = existingConversations[0];

    if(singleConversation){
      return NextResponse.json(singleConversation, {status: 200})
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include:{
        users: true
      }
    })

    return NextResponse.json(newConversation);

  }catch(error:any){
    return new NextResponse('Internal Error', {status: 500})
  }
}
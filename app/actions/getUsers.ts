import getSession from "./getSession";
import prisma from '@/app/lib/prismadb'

const getUsers = async () =>{
  const session = await getSession();

  if(!session?.user?.email){
    return null;
  }

  try{
    const users = await prisma.user.findMany({
      orderBy:{
        createdAt: 'desc'
      },
      // we're finding sll the email where the email is not our current user
      where: {
        NOT: {
          email: session.user.email
        }
      }
    });
    return users;
  }catch(error: any){
    return [];
  }


}

export default getUsers





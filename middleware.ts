import {withAuth} from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/',
  }
})


export const config = {
  matcher: [
    //always a good practice to use :path* so it can match all url with users
    '/users/:path*'
  ]
};
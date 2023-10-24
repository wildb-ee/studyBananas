import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "username" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            let error =false;

            const res1 = await fetch("http://localhost:8000/user/token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: credentials?.username,
                  password: credentials?.password,
                }),
            });
              
            const tokens = await res1.json();
            const res2 = await fetch("http://localhost:8000/user/get/profile", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                  },
            });
          
            
            if (!res1.ok || !res2.ok){
                return null;
            }
            

            const profile =  await res2.json();
            
            if (profile && tokens) {
              // Any object returned will be saved in `user` property of the JWT
              return {...profile, ...tokens}
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          }
        })
      ],
      callbacks: {
        async jwt({ token, user, trigger, session }) {
          if(trigger==='update'){
            return {...token, ...session.user};
          }

          return { ...token, ...user }
        },
        async session({ session, token, user }) {
          session.user = token
          return session
        },
      },

}
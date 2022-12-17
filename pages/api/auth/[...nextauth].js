import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';

export default NextAuth({
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                //Connect to DB
                const client = await MongoClient.connect(
                    process.env.URI,
                    { useNewUrlParser: true, useUnifiedTopology: true }
                );
                //Get all the users
                const users = await client.db().collection('users');
                //Find user with the email
                const result = await users.findOne({
                    email: credentials.email,
                });
                //Not found - send error res
                if (!result) {
                    client.close();
                    throw new Error('No user found with the email');
                }
                //Check hased password with DB password
                const checkPassword = await compare(credentials.password, result.password);
                //Incorrect password - send response
                if (!checkPassword) {
                    client.close();
                    throw new Error('Password doesnt match');
                }
                //Else send success response
                client.close();
                return { email: result.email };
            },
        }),
    ],
    callbacks: {
        // called after sucessful signin
        jwt: async ({ token, user }) => {
            if (user) token.id = user.id
            return token
        }, // called whenever session is checked
        session: async ({ session, token }) => {
            if (token) session.id = token.id
            return session
        },
    },
    secret: process.env.SECRET_KEY,
    session: {
        strategy: 'jwt',
        maxAge: 1 * 24 * 60 * 60, // 1d
    },
    jwt: {
        secret: process.env.SECRET_KEY,
        encryption: true,
    },
});
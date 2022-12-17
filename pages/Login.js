import React, { useState } from 'react';
import styles from '../styles/form.module.css';
//import {LOGIN_USER } from '../utils/apip-defs';
import {signIn} from "next-auth/react"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [isSignUp, setIsSignUp] = useState(false);

    async function onSignInSubmit() {
        const status = await signIn('credentials', {
            redirect: true,
            email: email,
            password: password,
            callbackUrl: 'http://localhost:3000/'
        });
    }

    const onSignUpSubmit = async () => {

        //Validation
        if (!email || !email.includes('@') || !password) {
            alert('Invalid details');
            return;
        }

        //POST form values
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        //Await for data for any desirable next steps
        const data = await res.json();
    };

    const renderSignUpForm = () => {
        if(isSignUp){
            return(
                <div className = {styles.containerItem}>
                    <label>Name:</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            )
        }
        return;
    }

    const renderSignInButton = () => {
        if(isSignUp){
            return;
        }
        return(
            <input
            type="submit"
            value="Sign In"
            onClick={() => onSignInSubmit()}
        />
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerItem}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={styles.containerItem}>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {renderSignUpForm()}
            <div className={styles.containerItem}>
                {renderSignInButton()}
                <input
                    type="submit"
                    value="Sign Up"
                    onClick = {() => {
                        if(isSignUp){
                            onSignUpSubmit();
                        } else {
                            setIsSignUp(true);
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Login;
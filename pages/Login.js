import React, {useState} from 'react';
import styles from '../styles/form.module.css';
//import {LOGIN_USER } from '../utils/apip-defs';

const Login = () => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    async function onSubmit() {
        const response = await fetch('http://localhost:5001/api/v1/user/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password })
          });
          const success = await res.json();
          console.log(success);
      }

      async function onSubmit2() {
        const response = await fetch('http://localhost:5001/api/v1/user/authenticate', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                withCredentials: true
            },
          });
          try {
            const user = await response.json();
            // Print the user's information in the console
            console.log(user);
          } catch (err) {
            // Handle any errors that occur when parsing the JSON response
            console.error(err);
          }
      }

    return(
        <div className = {styles.container}>
            <div className = {styles.containerItem}>
                <label>Email:</label>
                <input 
                    type = "email"
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}
                />
            </div>
            <div className = {styles.containerItem}>
                <label>Password:</label>
                <input 
                    type = "password"
                    value={password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
            </div>
            <div className = {styles.containerItem}>
                <input 
                    type = "submit"
                    onClick = {() => onSubmit()}
                />
            </div>
            <div className = {styles.containerItem}>
                <input 
                    type = "submit"
                    onClick = {() => onSubmit2()}
                />
            </div>
        </div>
    )
}

export default Login;
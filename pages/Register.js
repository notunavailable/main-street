import React, {useState} from 'react';
import styles from '../styles/form.module.css';
import {REGISTER_USER } from '../utils/api-defs';

const Register = () => {
    const[email, setEmail] = useState('');
    const[name, setName] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    async function onSubmit() {
        const response = await fetch('http://localhost:5001/api/v1/user/register', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, name: name, username: username, password: password, admin: false })
          });
          const success = await response.json();
          console.log(success);
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
                <label>Name:</label>
                <input 
                    type = "text"
                    value={name}
                    onChange = {(e) => setName(e.target.value)}
                />
            </div>
            <div className = {styles.containerItem}>
                <label>Username:</label>
                <input 
                    type = "text"
                    value={username}
                    onChange = {(e) => setUsername(e.target.value)}
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
        </div>
    )
}

export default Register;
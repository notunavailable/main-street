import React from 'react';
import styles from '../styles/header.module.css';
import Link from 'next/link';
import { signOut} from 'next-auth/react';

const Header = ({session}) => {

    async function onLogOut() {
        const status = await signOut('credentials', {
          redirect: true,
          callbackUrl: 'http://localhost:3000/Login'
        });
      }

    const renderButton = () => {
        if(session){
            return <h2 className = {styles.button} onClick = {onLogOut}>Log Out</h2>
        } else {
            return <Link href = "/Login"><h2>Sign In</h2></Link>
        }
    }

    return(
        <div className = {styles.container}>
            <Link href = "/About" ><h2>About</h2></Link>
            <Link href = "/"><h2>Main St</h2></Link>
            {renderButton()}
        </div>
    )
}

export default Header;
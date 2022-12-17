import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Outside from '../components/Outside.js'
import Inside from '../components/Inside.js'
import React, { useState, useEffect } from 'react'
import shops from '../data/shops.js';
import { getSession, useSession } from 'next-auth/react';
import Header from '../components/Header';

const insideShop = ({ id, session }) => {
    const sprite = {
        up: '/playerUp.png',
        down: 'playerDown.png',
        right: 'playerRight.png',
        left: 'playerLeft.png'
      }
    return (
    <div>
        <Header session={session} />
        <div className={styles.street}>
            <h1 className={styles.streetWriting}>{shops[id].inside.name}</h1>
        </div>
        <div className = {styles.container}>
        <Inside shop={shops[id]} characterInput={sprite} />
        </div>
    </div>
    )
}

export default insideShop;

export async function getServerSideProps( context ) {
    const id = context.query.id
    const session = await getSession(context)

    if (!session) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      }
    }
    return {
        props: { id, session }
    }
}
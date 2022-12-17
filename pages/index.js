import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Outside from '../components/Outside.js'
import Inside from '../components/Inside.js'
import React, { useState, useEffect } from 'react'
import shops from '../data/shops.js';
import { getSession, useSession } from 'next-auth/react';
import Header from '../components/Header';



export default function Home({ session }) {
  const [inside, setInside] = useState(-1);


  //const { data: session1 } = useSession()
  //console.log("main")
  //console.log(session1?.user?.email);

  //console.log("server side")

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
          <h1 className={styles.streetWriting}>Main St</h1>
        </div>
      <div className={styles.container}>
        <Outside shops={shops} characterInput={sprite} setInside={setInside} inside={inside} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
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
    props: { session }
  }
}
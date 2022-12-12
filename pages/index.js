import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Game from '../components/Game.js'
import msCollisions from '../data/collisions.js'
import React, {useState, useEffect} from 'react'
import shops from '../data/shops.js';

export default function Home() {
  const [insideMap, setInsideMap] = useState("main-street")
  const [isInside, setIsInside] = useState(false);
  
  useEffect(() => {
    if(insideMap != "main-street"){

    }
    }, [insideMap])

  const sprite = {
    up: '/playerUp.png',
    down: 'playerDown.png',
    right: 'playerRight.png',
    left: 'playerLeft.png'
  }
  return (
    <div className={styles.container}>
      <Game shops = {shops} characterInput = {sprite}/>
    </div>
  )
}

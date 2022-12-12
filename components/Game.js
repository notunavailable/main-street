import React, { useEffect, useRef } from 'react'
import Sprite from '../classes/Sprite.js'
import Boundary from '../classes/Boundary.js'
import rectangularCollision from '../helper/rectangularCollision.js'

const Game = ({ shops, characterInput, ...props }) => {
    const canvasRef = useRef(null)
    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = 1024
        canvas.height = 576

        let mapPieces = [];
        let collisionPieces = [];
        let collisionTransportPieces = [];
        shops.forEach(shop => {
            let image = new Image()
            image.src = shop.outside
            mapPieces.push(image)
            collisionPieces.push(shop.collisions)
            collisionTransportPieces.push(shop.collisionTransport);
        })

        let velocity = 3;


        const playerDownImage = new Image()
        playerDownImage.src = characterInput.down
        const playerUpImage = new Image()
        playerUpImage.src = characterInput.up
        const playerLeftImage = new Image()
        playerLeftImage.src = characterInput.left
        const playerRightImage = new Image()
        playerRightImage.src = characterInput.right

        const collisionsMapPieces = []
        collisionPieces.forEach(collisions => {
            let tmp = [];
            for (let i = 0; i < collisions.length; i += 40) {
                tmp.push(collisions.slice(i, i + 40))
            }
            collisionsMapPieces.push(tmp);
        })

        const offset = {
            x: 0,
            y: 0
        }

        let backgroundSprites = []
        mapPieces.forEach((piece, index) => {
            backgroundSprites.push(new Sprite({
                position: {
                    x: offset.x + (index * piece.width),
                    y: offset.y
                },
                image: piece,
                velocity: 3,
                context: context
            }))
        })

        const player = new Sprite({
            position: {
                x: canvas.width / 2,
                y: canvas.height / 2
            },
            image: playerDownImage,
            frames: {
                max: 4
            },
            sprites: {
                up: playerUpImage,
                down: playerDownImage,
                left: playerLeftImage,
                right: playerRightImage
            },
            context: context

        })


        let boundaries = []
        collisionsMapPieces.forEach((collisionsMap, pieceIndex) => {
            collisionsMap.forEach((row, rowIndex) => {
                row.forEach((symbol, columnIndex) => {
                    if (symbol === 67) {
                        boundaries.push(new Boundary({
                            position: {
                                x: (pieceIndex * 1920 * 1.5) +(columnIndex * Boundary.width) + offset.x,
                                y: (rowIndex*Boundary.height) + offset.y
                            },
                            context: context
                        }))
                    }
                })
            })
        })
    

        const keys = {
            w: {
                pressed: false
            },
            a: {
                pressed: false
            },
            s: {
                pressed: false
            },
            d: {
                pressed: false
            }
        }

        const movables = [...backgroundSprites, ...boundaries]
        function animate() {
            window.requestAnimationFrame(animate)
            backgroundSprites.forEach(background => background.draw())
            boundaries.forEach(boundary => boundary.draw())
            player.draw()
            let moving = true
            player.moving = false
            if (keys.w.pressed && lastKey === 'w') {
                player.moving = true
                player.image = player.sprites.up
                for (let i = 0; i < boundaries.length; i++) {
                    const boundary = boundaries[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...boundary, position: {
                                x: boundary.position.x,
                                y: boundary.position.y + 5
                            }
                        }
                    })) {
                        console.log('collision');
                        moving = false
                        break
                    }
                }
                if (moving) {
                    movables.forEach((movable) => {
                        movable.position.y += movable.velocity
                    })
                }
            }
            else if (keys.s.pressed && lastKey === 's') {
                player.image = player.sprites.down
                player.moving = true
                for (let i = 0; i < boundaries.length; i++) {
                    const boundary = boundaries[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...boundary, position: {
                                x: boundary.position.x,
                                y: boundary.position.y - 5
                            }
                        }
                    })) {
                        moving = false
                        break
                    }
                }
                if (moving) {
                    movables.forEach((movable) => {
                        movable.position.y -= movable.velocity
                    })
                }
            }
            else if (keys.a.pressed && lastKey === 'a') {
                player.image = player.sprites.left
                player.moving = true
                for (let i = 0; i < boundaries.length; i++) {
                    const boundary = boundaries[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...boundary, position: {
                                x: boundary.position.x + 5,
                                y: boundary.position.y
                            }
                        }
                    })) {
                        moving = false
                        break
                    }
                }
                if (moving) {
                    movables.forEach((movable) => {
                        movable.position.x += movable.velocity
                    })
                }
            }
            else if (keys.d.pressed && lastKey === 'd') {
                player.image = player.sprites.right
                player.moving = true
                for (let i = 0; i < boundaries.length; i++) {
                    const boundary = boundaries[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...boundary, position: {
                                x: boundary.position.x - 5,
                                y: boundary.position.y
                            }
                        }
                    })) {
                        moving = false
                        break
                    }
                }
                if (moving) {
                    movables.forEach((movable) => {
                        movable.position.x -= movable.velocity
                    })
                }
            }

        }
        animate()

        let lastKey = '';
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'w':
                    keys.w.pressed = true
                    lastKey = 'w'
                    break
                case 'a':
                    keys.a.pressed = true
                    lastKey = 'a'
                    break
                case 's':
                    keys.s.pressed = true
                    lastKey = 's'
                    break
                case 'd':
                    keys.d.pressed = true
                    lastKey = 'd'
                    break
            }
        })

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'w':
                    keys.w.pressed = false
                    break
                case 'a':
                    keys.a.pressed = false
                    break
                case 's':
                    keys.s.pressed = false
                    break
                case 'd':
                    keys.d.pressed = false
                    break
            }
        })
    }, [])
    return <canvas ref={canvasRef} {...props} />
}
export default Game
import React, { useEffect, useRef } from 'react'
import Sprite from '../classes/Sprite.js'
import Boundary from '../classes/Boundary.js'
import rectangularCollision from '../helper/rectangularCollision.js'

const Outside = ({ shop, characterInput, setInside, ...props }) => {

    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = 1024
        canvas.height = 700

        let mapPieces = [];
        let collisionPieces = [];
        let collisionTransportPieces = [];
        let foregroundPieces = [];
        let map = new Image()
        map.src = shop.inside.path
        mapPieces.push(map)

        let foreground = new Image()
        foreground.src = shop.inside.foreground
        foregroundPieces.push(foreground);

        collisionPieces.push(shop.inside.collisions)
        collisionTransportPieces.push(shop.inside.collisionTransport);


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

        const collisionsTransportMapPieces = []
        collisionTransportPieces.forEach(collisionsTransport => {
            let tmp = [];
            for (let i = 0; i < collisionsTransport.length; i += 40) {
                tmp.push(collisionsTransport.slice(i, i + 40))
            }
            collisionsTransportMapPieces.push(tmp);
        })

        const offset = {
            x: -416,
            y: -800
        }

        let endImageWidth = 0;

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
            endImageWidth += piece.width;
        })

        let foregroundSprites = []
        foregroundPieces.forEach((piece, index) => {
            foregroundSprites.push(new Sprite({
                position: {
                    x: offset.x + (index * piece.width),
                    y: offset.y
                },
                image: piece,
                velocity: 3,
                context: context
            }))
        })

        const startingPos = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        const player = new Sprite({
            position: startingPos,
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
            context: context,
            velocity: 3
        })


        let boundaries = []
        collisionsMapPieces.forEach((collisionsMap, pieceIndex) => {
            collisionsMap.forEach((row, rowIndex) => {
                row.forEach((symbol, columnIndex) => {
                    if (symbol === 67) {
                        boundaries.push(new Boundary({
                            position: {
                                x: (pieceIndex * 1920) + (columnIndex * Boundary.width) + offset.x,
                                y: (rowIndex * Boundary.height) + offset.y
                            },
                            context: context,
                            velocity: 3
                        }))
                    }
                })
            })
        })


        let transports = []
        collisionsTransportMapPieces.forEach((collisionTransportsMap, pieceIndex) => {
            collisionTransportsMap.forEach((row, rowIndex) => {
                row.forEach((symbol, columnIndex) => {
                    if (symbol === 67) {
                        transports.push({
                            transport: new Boundary({
                                position: {
                                    x: (pieceIndex * 1920) + (columnIndex * Boundary.width) + offset.x,
                                    y: (rowIndex * Boundary.height) + offset.y
                                },
                                context: context,
                                velocity: 3
                            }), number: pieceIndex
                        })
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

        let transportMovables = [];
        transports.forEach((transport) => {
            transportMovables.push(transport.transport)
        })

        const movables = [...backgroundSprites, ...boundaries, ...foregroundSprites, ...transportMovables]
        let moveCharacter = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };

        function animate() {
            window.requestAnimationFrame(animate)
            backgroundSprites.forEach(background => {
                background.draw()
                moveCharacter.top = background.checkBoundaryTop();
                moveCharacter.bottom = background.checkBoundaryBottom(canvas.height);
            })
            moveCharacter.left = backgroundSprites[0].checkBoundaryLeft();
            moveCharacter.right = backgroundSprites[backgroundSprites.length - 1].checkBoundaryRight(canvas.width);
            //boundaries.forEach(boundary => boundary.draw())
            //transports.forEach(transport => transport.transport.draw())
            player.draw()
            foregroundSprites.forEach(foreground => foreground.draw())
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
                        moving = false
                        break
                    }
                }
                for (let i = 0; i < transports.length; i++) {
                    const transport = transports[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...transport.transport, position: {
                                x: transport.transport.position.x,
                                y: transport.transport.position.y + 5
                            }
                        }
                    })) {
                        window.location = "http://www.localhost:3000/"
                        break
                    }
                }
                if (moving) {
                    if (moveCharacter.top || player.position.y > canvas.height / 2) {
                        player.position.y -= player.velocity
                    } else {
                        movables.forEach((movable) => {
                            movable.position.y += movable.velocity
                        })
                    }
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
                for (let i = 0; i < transports.length; i++) {
                    const transport = transports[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...transport.transport, position: {
                                x: transport.transport.position.x,
                                y: transport.transport.position.y - 5
                            }
                        }
                    })) {
                        window.location = "http://www.localhost:3000/"
                        break
                    }
                }
                if (moving) {
                    if (moveCharacter.bottom || player.position.y < canvas.height / 2) {
                        player.position.y += player.velocity
                    } else {
                        movables.forEach((movable) => {
                            movable.position.y -= movable.velocity
                        })
                    }
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
                for (let i = 0; i < transports.length; i++) {
                    const transport = transports[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...transport.transport, position: {
                                x: transport.transport.position.x + 5,
                                y: transport.transport.position.y
                            }
                        }
                    })) {
                        window.location = "http://www.localhost:3000/"
                        break
                    }
                }
                if (moving) {
                    if (moveCharacter.left || player.position.x > canvas.width / 2) {
                        player.position.x -= player.velocity
                    } else {
                        movables.forEach((movable) => {
                            movable.position.x += movable.velocity
                        })
                    }
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
                for (let i = 0; i < transports.length; i++) {
                    const transport = transports[i]
                    if (rectangularCollision({
                        rectangle1: player, rectangle2: {
                            ...transport.transport, position: {
                                x: transport.transport.position.x - 5,
                                y: transport.transport.position.y
                            }
                        }
                    })) {
                        window.location = "http://www.localhost:3000/"
                        break
                    }
                }

                if (moving) {
                    if (moveCharacter.right || player.position.x < canvas.width / 2) {
                        player.position.x += player.velocity
                    } else {
                        movables.forEach((movable) => {
                            movable.position.x -= movable.velocity
                        })
                    }
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
export default Outside
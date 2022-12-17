import collisions from './collisions.js';
import collisionTransport from './collisionTransport.js';

const shops = [
    {outside: {path: '/generic_map.png', foreground: '/foreground.png',collisionTransport: collisionTransport, collisions: collisions}, inside: {name: 'Strafe', path: '/generic_map.png', foreground: '/foreground.png',collisionTransport: collisionTransport, collisions: collisions}},
    {outside: {path: '/generic_map.png', foreground: '/foreground.png',collisionTransport: collisionTransport, collisions: collisions}, inside: {name: 'Madhappy', path: '/generic_map.png', foreground: '/foreground.png',collisionTransport: collisionTransport, collisions: collisions}},
    {outside: {path: '/generic_map.png', foreground: '/foreground.png',collisionTransport: collisionTransport, collisions: collisions}, inside: {name: 'Madhappy', path: '/generic_map.png', foreground: '/foreground.png',collisionTransport: collisionTransport, collisions: collisions}},
  ]

  export default shops;
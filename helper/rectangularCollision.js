export default function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + (rectangle1.width*3)/4 >= rectangle2.position.x
        && rectangle1.position.x + rectangle1.width/4 <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y + (rectangle1.height*4)/6 <= rectangle2.position.y + rectangle2.height
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

/*export default function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y + rectangle1.height <= rectangle2.position.y + rectangle2.height
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}*/
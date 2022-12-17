export default class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 }, sprites, context }) {
        this.position = position
        this.image = image
        this.velocity = velocity
        this.frames = { ...frames, val: 0, elapsed: 0 }

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
        this.context = context
    }

    draw() {
        this.context.drawImage(
            this.image,
            this.frames.val * this.image.width/this.frames.max, //x coordinate to begin cropping from
            0, //y coordinate to begin cropping from
            this.image.width / this.frames.max, //x coordinate to end cropping
            this.image.height, //y coordinate to end cropping
            this.position.x, //x where image is placed on the canvas - playerImage.width/4/2
            this.position.y, //y where image is placed on the canvas
            this.image.width / this.frames.max, //width the image is rendered out at
            this.image.height, //height the image is rendered out at
        )
        if(!this.moving) return
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }

    checkBoundaryLeft() {
        return this.position.x >= 0
    }
    checkBoundaryRight(width){
        return this.position.x + this.image.width <= width
    }
    checkBoundaryBottom(height){
        return this.position.y + this.image.height <= height
    }
    checkBoundaryTop(){
        return this.position.y >= 0
    }
}
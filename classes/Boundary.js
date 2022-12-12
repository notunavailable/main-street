class Boundary {
    static width = 32 * 1.5
    static height = 32 * 1.5
    constructor({ position, context }) {
        this.position = position
        this.width = 32 * 1.5 //pixel 32 width * 70%
        this.height = 32 * 1.5//pixel 32 height * 70%
        this.context = context
    }

    draw() {
        this.context.fillStyle = "red";
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

export default Boundary
export class Snake {
  constructor(startX, startY, box, canvasWidth, canvasHeight) {
    this.box = box;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.body = [{ x: startX, y: startY }];
    this.direction = 'RIGHT';
    this.pendingDirection = null;
  }

  setDirection(newDir) {
    const opposites = {
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
      UP: 'DOWN',
      DOWN: 'UP',
    };
    if (newDir !== opposites[this.direction]) {
      this.pendingDirection = newDir;
    }
  }

  move() {
    if (this.pendingDirection) {
      this.direction = this.pendingDirection;
      this.pendingDirection = null;
    }

    const head = { ...this.body[0] };
    if (this.direction === 'LEFT') head.x -= this.box;
    if (this.direction === 'UP') head.y -= this.box;
    if (this.direction === 'RIGHT') head.x += this.box;
    if (this.direction === 'DOWN') head.y += this.box;

    // Wrap
    if (head.x < 0) head.x = this.canvasWidth - this.box;
    if (head.x >= this.canvasWidth) head.x = 0;
    if (head.y < 0) head.y = this.canvasHeight - this.box;
    if (head.y >= this.canvasHeight) head.y = 0;

    this.body.unshift(head);
  }

  checkCollision() {
    const [head, ...tail] = this.body;
    return tail.some((segment) => segment.x === head.x && segment.y === head.y);
  }

  grow() {}
  shrink() {
    this.body.pop();
  }

  draw(ctx) {
    for (let part of this.body) {
      ctx.fillStyle = '#0f0';
      ctx.fillRect(part.x, part.y, this.box, this.box);
    }
  }

  get head() {
    return this.body[0];
  }
}

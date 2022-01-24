const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

x = canvas.width / 2;
y = canvas.height / 2;
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
class Projectile extends Player {
  constructor(x, y, radius, color, velocity) {
    super(x, y);
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const shooter = new Player(this.x, this.y, 30, "black");
shooter.draw();

const projectiles = [];

function animate() {
  requestAnimationFrame(animate);
  projectiles.forEach((projectile) => {
    projectile.update();
  });
}

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x : Math.cos(angle)
  }

  projectiles.push(new Projectile(this.x, this.y, 10, "blue", { x: 1, y: 1 }));
});
animate();

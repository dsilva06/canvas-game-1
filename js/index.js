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
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemy extends Projectile {}

const shooter = new Player(this.x, this.y, 15, "orangered");

const projectiles = [];
const enemies = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (35 - 8) + 8;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    const velocity = {
      x: Math.cos(angle) * 3,
      y: Math.sin(angle) * 3,
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}
let engine;
function animate() {
  engine = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  shooter.draw();
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // REMOVING PROJECTILES FROM SCREEN
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });


  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(shooter.x - enemy.x, shooter.y - enemy.y);

    // END GAME
    if (dist - enemy.radius - shooter.radius < 1) {
      cancelAnimationFrame(engine);
    }

    // PROJECTILE ELIMINATION
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // WHEN PROJECTILES TOUCH ENEMIES
      if (dist - enemy.radius - projectile.radius < 1) {
        if (enemy.radius - 8 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 8
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };

  projectiles.push(new Projectile(this.x, this.y, 5, "orangered", velocity));
});
animate();
spawnEnemies();

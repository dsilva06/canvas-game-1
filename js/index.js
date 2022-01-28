window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const score = document.getElementById("score");
  const startGame = document.getElementById("startGame");
  const modalEl = document.getElementById("modalEl");
  const finalResult = document.getElementById("finalResult");

  x = canvas.width / 2;
  y = canvas.height / 2;

  // SOUND EFFECTS
  var backgroundMusic = new Audio("../music/boxcat-games-battle-boss.mp3");

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

  const friction = 0.99;
  class Particle extends Projectile {
    constructor(x, y, radius, color, velocity) {
      super(x, y, radius, color, velocity);
      this.alpha = 1;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.draw();
      this.velocity.x *= friction;
      this.velocity.y *= friction;
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
      this.alpha -= 0.01;
    }
  }

  let projectiles = [];
  let enemies = [];
  let enemyInterval;
  let particles = [];

  function init() {
    shooter = new Player(this.x, this.y, 15, "orangered");
    projectiles = [];
    enemies = [];
    particles = [];
    points = 0;
    score.innerHTML = points;
    finalResult.innerHTML = points;
    spawnEnemies();
   
    // LOOPING BACKGROUND MUSIC
    if (typeof backgroundMusic.loop == "boolean") {
      backgroundMusic.loop = true;
    } else {
      backgroundMusic.addEventListener(
        "ended",
        function () {
          this.currentTime = 0;
          this.play();
        },
        false
      );
    }
    backgroundMusic.play()
  }

  function spawnEnemies() {
    enemyInterval = setInterval(() => {
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
        x: Math.cos(angle) * 2,
        y: Math.sin(angle) * 2,
      };

      enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
  }
  let engine;
  let points = 0;

  // START ANIMATION
  function animate() {
    engine = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    shooter.draw();

    // PARTICLE EXPLOSION WHEN HITTING ENEMIES
    particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      } else {
        particle.update();
      }
      particle.update();
    });

    // PLAYERS PROJECTILES
    projectiles.forEach((projectile, index) => {
      projectile.update();

      // REMOVING PROJECTILES ARRAY WHEN NO LONGER IN SCREEN
      if (
        projectile.x - projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        setTimeout(() => {
          projectiles.splice(index, 1);
          console.log(projectiles);
        }, 0);
      }
    });

    enemies.forEach((enemy, index) => {
      enemy.update();

      const dist = Math.hypot(shooter.x - enemy.x, shooter.y - enemy.y);

      // PROJECTILE ELIMINATION
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        // WHEN PROJECTILES TOUCH ENEMIES
        if (dist - enemy.radius - projectile.radius < 1) {
          // CREATE EXPLOSIONS
          for (let i = 0; i < enemy.radius; i++) {
            particles.push(
              new Particle(
                projectile.x,
                projectile.y,
                Math.random() * 2,
                enemy.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 5),
                  y: (Math.random() - 0.5) * (Math.random() * 5),
                }
              )
            );
          }
          if (enemy.radius - 8 > 10) {
            // INCREASE SCORE
            points += 50;
            score.innerHTML = points;
            // END INCREASE SCORE

            // SHRINK
            gsap.to(enemy, {
              radius: enemy.radius - 8,
            });
            setTimeout(() => {
              projectiles.splice(projectileIndex, 1);
            }, 0);
            // END SHRINK
          } else {
            // INCREASE SCORE
            points += 100;
            score.innerHTML = points;
            // END INCREASE SCORE

            // SHRINK
            setTimeout(() => {
              enemies.splice(index, 1);
              projectiles.splice(projectileIndex, 1);
            }, 0);
            // END SHRINK
          }
        }
      });
      // END GAME
      if (dist - enemy.radius - shooter.radius < 1) {
        clearInterval(enemyInterval);
        cancelAnimationFrame(engine);
        modalEl.style.display = "flex";
        finalResult.innerHTML = points;
      }
    });
  }

  // PROJECTILE DIRECTION AND VELOCITY
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
  startGame.addEventListener("click", () => {
    init();
    animate();

    modalEl.style.display = "none";
  });
};

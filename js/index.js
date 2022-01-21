const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


canvas.width = innerWidth;
canvas.height = innerHeight;

class Player{
  constructor(x, y, radius, color){
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = radius ;
    this.color = color
  }
  draw(){
    ctx.beginPath()
    ctx.arc(this.x , this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}




const shooter = new Player (this.x, this.y, 30, 'black')
shooter.draw()
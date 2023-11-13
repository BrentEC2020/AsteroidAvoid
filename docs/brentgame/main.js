title = "Asteroid Avoid";

description = `
Cross the Asteroid Field Using Spacebar!
`;

characters = [];

const G = {
	WIDTH: 300,
	HEIGHT: 150,
  STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
  PLAYER_CHANGE_RATE: 4,
  ENEMY_MIN_BASE_SPEED: 1.0,
  ENEMY_MAX_BASE_SPEED: 2.0
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  theme: "pixel",
  isReplayEnabled: true,
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2
};

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Star
  */
  
  /**
  * @type  { Star [] }
  */
  let stars;

/**
 * @typedef {{
* pos: Vector,
* }} Player
*/

/**
* @type { Player }
*/
let player;

/**
 * @typedef {{
* pos: Vector
* }} Enemy
*/

/**
* @type { Enemy [] }
*/
let enemies;

/**
* @type { number }
*/
let currentEnemySpeed;

/**
* @type { number }
*/
let waveCount;

characters = [
`
rrrr
rrrrL
RRLCCL
RRLCCL
rrrrL
rrrr 
`,`
 gg yL
gyggggg
gggggyg
ggLyLgg
gyygggg
  Lyg
`,
];

function update() {
  if (!ticks) {
    // A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
		stars = times(20, () => {

      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
      };
    });

    player = {
      pos: vec(G.WIDTH * 0.5 - 140, G.HEIGHT * 0.5 + 60)
    };
    document.addEventListener('keydown', function(event) {
      //left
      if(event.keyCode == 32) {
          play("jump");
          player.pos.x += 10;
          color("light_yellow")
          particle(
            player.pos.x - 5, // x coordinate
            player.pos.y + 4, // y coordinate
            20, // The number of particles
            1, // The speed of the particles
            -PI/2, // The emitting angle
            PI/4  // The emitting width
          );
          
          if (player.pos.x == G.WIDTH) {
            addScore(100, 20, 110)
            play("powerUp");
            G.ENEMY_MAX_BASE_SPEED += 0.05;
            G.ENEMY_MIN_BASE_SPEED += 0.05;
            player.pos.x = 0;
          }
      }
    });

    // Initalise the values:
    enemies = [];

    waveCount = 0;
    currentEnemySpeed = 0;
  }
  
  color("black");
  // box(player.pos, 4);
  char("a", player.pos);

  // Another update loop
    // This time, with remove()
    remove(enemies, (e) => {
      const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
      if (isCollidingWithPlayer) {
          end();
          play("explosion");
      }
      e.pos.y += currentEnemySpeed;

      char("b", e.pos)
      return (e.pos.y > G.HEIGHT);
    });
    

  if (enemies.length === 0) {
    currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 9; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            enemies.push({ pos: vec(posX, posY) })
        }
  }

  stars.forEach((s) => {
        // Move the star downwards
        s.pos.y += s.speed;
        // Bring the star back to top once it's past the bottom of the screen
        s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

        // Choose a color to draw
        color("light_black");
        // Draw the star as a square of size 1
        box(s.pos, 1);
    });
    
  
  //player.pos = vec(input.pos.x, input.pos.y);
  //player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);

}

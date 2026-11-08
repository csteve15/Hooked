let img;
let img_bait;
let img_health;
let img_level;
let img_floor;
let img_enemy;
let gameFont;

let eatSound;
let hurtSound;
let gameMusic;
let levelUp;


let baitX = [];
let baitY = [];
let enemyFish = [];

// (spawn rate 30: impossible // 50: hard // 70: medium // 110: easy)
let spawnRate = 50
let score = 0;
let playerLevel = 1;
let playerLives = 3;
let playerOffsetX = 25;
let playerOffsetY = 40;
let eatDistance = 40;
let gameStarted = false;

function preload() {

	img = loadImage('player-fish1.png');

	//	img_rock = loadImage('rock1.png');

			img_bait = loadImage('bait.png')

				img_health = loadImage('health.png');

					img_level = loadImage('level.png');

						img_floor = loadImage('floor.png');

							img_enemy = loadImage('enemy_fish.png');

	eatSound = loadSound('point.wav');

	gameMusic = loadSound('arcade.wav');

	hurtSound = loadSound('damage.wav');

	levelUp = loadSound('upsize.wav');

	gameFont = loadFont('Pixeled.ttf');
}



function setup() {
	createCanvas(1200, 800);

	noCursor();

	img.resize(140, 0);

//	img_rock.resize(110, 0);

		img_bait.resize(60, 0);

			img_health.resize(55, 0);

				img_level.resize(50, 0);

					img_floor.resize(1250, 895);

						img_enemy.resize(200, 0);

	eatSound.setVolume(0.1);

	levelUp.setVolume(0.6);
}



function draw() {

	background(12, 24, 46);

	//Floor
	fill(255, 184, 111);
	noStroke();
	rect(0, 700, 1200, 100);
	
	rect(0, 680, 10, 20);
	rect(0, 690, 20, 20);
	
	image(img_floor, 0, 40);

	

	if (gameStarted) {
		
	
//worm
	if (baitX.length === 0) {
		baitX.push(random(30, 1170));
		baitY.push(random(30, 770));
	}

	//worm collision logic
	for (let i= baitX.length -1; i >= 0; i--) {
		if (dist(mouseX + playerOffsetX, mouseY + playerOffsetY, baitX[i], baitY[i]) < eatDistance) {
			eatSound.play();
			baitX.splice(i, 1);
			baitY.splice(i, 1);

			score++;

			if(score=== 10) {
				img.resize(280, 0);
				
				playerOffsetX = 50;
				playerOffsetY = 40;
				eatDistance = 65;
				playerLevel = 2;
				levelUp.play();
			}

			if(score === 25)  {
				img.resize(460, 0);

				playerOffsetX = 70;
				playerOffsetY = 115;
				eatDistance = 90;
				playerLevel = 3;
				levelUp.play();
			}
		}
	}




		//spawn fish

		if (frameCount % floor(spawnRate) === 0) {
			enemyFish.push(new enemy())

			if (spawnRate > 10) spawnRate -= 0.1;
		}


		for (let i= enemyFish.length -1; i >= 0; i--) {
			enemyFish[i].move();
			enemyFish[i].display();


			//enemy collision 
			let d = dist(mouseX + (img.width/2), mouseY + (img.height/2), enemyFish[i].x + 100, enemyFish[i].y + 100);

			if (d < 100) {
				playerLives -= 1;
				enemyFish.splice(i, 1);
				hurtSound.play();
				
				continue;

				
			}

			//get rid of extra fish
				if (enemyFish[i].x > width + 200) {
					enemyFish.splice(i, 1);
				}
		}

		
	}	


	drawWorm();

	
	 //Player-Fish Cursor
	image(img, mouseX, mouseY);
	

	//Display Score

	textFont(gameFont);
	textSize(20);
	fill(255, 196, 77);
	text('player score:  ' + score, 850, 50);

	text ('player level:  ' + playerLevel, 870, 100);

	text ('lives:  ' + playerLives, 50, 50);

	//Game Over

	if (playerLives <= 0) {

		text('game over', 520, 400);
		noLoop();
		gameMusic.pause();
	}
	
	
}


function drawWorm() {

	for (let i=0; i < baitX.length; i++) {
		image(img_bait, baitX[i], baitY[i]);
	}
		
	
}

class enemy {

	constructor() {
		this.x = -100
		this.y = random(50, 650);
		this.speed = random(2, 8);
	}

	move() {

		this.x += this.speed;
	}

	display() {
		image(img_enemy, this.x, this.y);
	}
}



function mousePressed() {
	if (gameStarted === false) {
		gameStarted = true;
		gameMusic.loop();
		gameMusic.setVolume(0.1);
	}
}




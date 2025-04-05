let player;
let laneWidth = 200;
let lineSpacing = 40;
let lines = [];
let playerSpeed = 5;
let scrollSpeed = 0;
let emp;
let EMP_ACTIVE = false;
let empIcon, rightMouseIcon;
let score = 0;
let lasers = [];
let zombies = [];
let zombieSpawnRate = 120;
let fullHeart, greyHeart;

function preload() {
	empIcon = loadImage("assets/images/empicon.png");
	rightMouseIcon = loadImage("assets/images/rightmouse.png");
	leftMouseIcon = loadImage("assets/images/leftmouse.png");
	laserIcon = loadImage("assets/images/laser.png");
	fullHeart = loadImage("assets/images/fheart.png");
	greyHeart = loadImage("assets/images/gheart.png");
}

function setup() {
	let canvas = createCanvas(400, 600);
	player = new Player();
	for (let y = 0; y < height; y += lineSpacing) {
		lines.push(y);
	}
	zombies.push(new Zombie(player));

	canvas.elt.oncontextmenu = (e) => {
		e.preventDefault();
	}; // This disables the context menu only in the confines of the canvas. (So that when EMP is used with right-click, the browser's context menu doesn't get in the way of the content.)
}
function mousePressed() {
	if (mouseButton === RIGHT) {
		emp = new EMPWave(mouseX, mouseY);
		EMP_ACTIVE = true;
	} else if (mouseButton === LEFT) {
		let laser = new Laser(createVector(player.x, player.y), player.rotation);
		lasers.push(laser);
	}
}
function draw() {
	background(220);
	stroke(0);
	strokeWeight(4);
	line(width / 2 - laneWidth / 2, 0, width / 2 - laneWidth / 2, height);
	line(width / 2 + laneWidth / 2, 0, width / 2 + laneWidth / 2, height);

	if (scrollSpeed !== 0) {
		for (let i = 0; i < lines.length; i++) {
			lines[i] += scrollSpeed;
			if (lines[i] > height) lines[i] -= height + lineSpacing;
			if (lines[i] < -lineSpacing) lines[i] += height + lineSpacing;
		}
	}

	for (let y of lines) {
		push();
		stroke(0);
		strokeWeight(4);
		line(width / 2, y, width / 2, y + 20);
		pop();
	}

	player.update();
	player.display();

	for (let i = lasers.length - 1; i >= 0; i--) {
		lasers[i].update();
		lasers[i].display();

		if (!lasers[i].alive) {
			lasers.splice(i, 1);
		}
	}

	if (EMP_ACTIVE) {
		emp.update();
		emp.display();

		if (emp.affects(player)) {
			player.applyEMPEffect(emp);
		}

		for (let zombie of zombies) {
			if (emp.affects(zombie)) {
				zombie.applyEMPEffect(emp);
			}
		}
		
	}

	if (!EMP_ACTIVE) {
		player.weight = 3;
	}

	// Spawn zombies every few seconds
	if (frameCount % zombieSpawnRate === 0) {
		zombies.push(new Zombie(player));
	}

	for (let i = zombies.length - 1; i >= 0; i--) {
		const z = zombies[i];
		z.update(player);
		z.display();
		for (let j = lasers.length - 1; j >= 0; j--) {
			const l = lasers[j];
			if (l.hits(z)) {
				zombies.splice(i, 1);
				lasers.splice(j, 1);
				score += 100;
				break;
			}
		}
	
		let d = dist(z.pos.x, z.pos.y, player.x, player.y);
		let collisionDist = z.size / 2 + player.size / 2;
	
		if (d < collisionDist) {
			let now = millis();
			let zID = i;
	
			if (!player.lastDamageTimes[zID]) {
				player.hearts--;
				player.lastDamageTimes[zID] = now;
			} else if (now - player.lastDamageTimes[zID] > 3000) {
				player.hearts--;
				player.lastDamageTimes[zID] = now;
			}
	
			player.hearts = max(0, player.hearts);
		} else {
			delete player.lastDamageTimes[i];
		}
	}

	drawHUD();
	drawHearts();
	drawScore();

	if (player.hearts <= 0) {
		noLoop();
		textSize(40);
		fill(255, 0, 0);
		textAlign(CENTER, CENTER);
		text("Game Over", width / 2, height / 2);
	}	
}

function drawHUD() {
	fill(255);
	textSize(20);
	textAlign(LEFT, CENTER);
	text("EMP", 20, height - 40);
	image(empIcon, 70, height - 55, 30, 30);
	image(rightMouseIcon, 110, height - 55, 30, 30);

	text("Laser", 20, height - 80);
	image(laserIcon, 75, height - 95, 30, 30);
	image(leftMouseIcon, 110, height - 95, 30, 30);
}

function drawScore() {
	fill(255);
	textSize(20);
	textAlign(RIGHT, TOP);
	text("Score: " + score, width - 20, 20);
}

function drawHearts() {
	let spacing = 40;
	let startX = 20;
	let y = height - 120;

	for (let i = 0; i < player.maxHearts; i++) {
		let img = i < player.hearts ? fullHeart : greyHeart;
		image(img, startX + i * spacing, y, 32, 32);
	}
}

// Helper function for smooth angle interpolation
function lerpAngle(current, target, t) {
	let diff = target - current;
	// Wrap diff to the range [-PI, PI]
	while (diff < -PI) diff += TWO_PI;
	while (diff > PI) diff -= TWO_PI;
	return current + diff * t;
}

// Note to self: Explanation for lerpAngle - the regular lep() method goes the long way to rotate to larger angles. To find the shortest path, lerpAngle always compares current angle to the target angle, finds the difference and rotates fractionally.

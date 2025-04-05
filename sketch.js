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

function preload() {
	empIcon = loadImage("assets/images/empicon.png");
	rightMouseIcon = loadImage("assets/images/rightmouse.png");
	leftMouseIcon = loadImage("assets/images/leftmouse.png");
	laserIcon = loadImage("assets/images/laser.png");
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
	}

	if (!EMP_ACTIVE) {
		player.weight = 3;
	}

	drawHUD();
	drawScore();

	// Spawn zombies every few seconds
	if (frameCount % zombieSpawnRate === 0) {
		zombies.push(new Zombie(player));
	}

	// Update and draw zombies
	for (let i = zombies.length - 1; i >= 0; i--) {
		zombies[i].update(player);
		zombies[i].display();
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

// Helper function for smooth angle interpolation
function lerpAngle(current, target, t) {
	let diff = target - current;
	// Wrap diff to the range [-PI, PI]
	while (diff < -PI) diff += TWO_PI;
	while (diff > PI) diff -= TWO_PI;
	return current + diff * t;
}

// Note to self: Explanation for lerpAngle - the regular lep() method goes the long way to rotate to larger angles. To find the shortest path, lerpAngle always compares current angle to the target angle, finds the difference and rotates fractionally.

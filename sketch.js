let player;
let laneWidth = 200;
let lineSpacing = 40;
let lines = [];
let playerSpeed = 5;
let playerVelY = 0;

function setup() {
	createCanvas(400, 600);
	player = new Player();
	for (let y = 0; y < height; y += lineSpacing) {
		lines.push(y);
	}
}

function draw() {
	background(220);
	stroke(0);
	strokeWeight(4);
	line(width / 2 - laneWidth / 2, 0, width / 2 - laneWidth / 2, height);
	line(width / 2 + laneWidth / 2, 0, width / 2 + laneWidth / 2, height);

	if (playerVelY !== 0) {
		for (let i = 0; i < lines.length; i++) {
			lines[i] += playerVelY;
			if (lines[i] > height) lines[i] -= height + lineSpacing;
			if (lines[i] < -lineSpacing) lines[i] += height + lineSpacing;
		}
	}

	for (let y of lines) {
		stroke(0);
		strokeWeight(4);
		line(width / 2, y, width / 2, y + 20);
	}

	player.update();
	player.display();
}
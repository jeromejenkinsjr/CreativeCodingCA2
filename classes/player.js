class Player {
	constructor() {
		this.size = 30;
		this.x = width / 2;
		this.y = height / 2;
		this.weight = 3;
	}

	update() {
		let effectiveSpeed = playerSpeed / this.weight;
		playerVelY = 0;

		if (
			keyIsDown(LEFT_ARROW) &&
			this.x - this.size / 2 > width / 2 - laneWidth / 2
		) {
			this.x -= effectiveSpeed;
		}
		if (
			keyIsDown(RIGHT_ARROW) &&
			this.x + this.size / 2 < width / 2 + laneWidth / 2
		) {
			this.x += effectiveSpeed;
		}
		if (keyIsDown(UP_ARROW)) {
			playerVelY = effectiveSpeed;
		}
		if (keyIsDown(DOWN_ARROW)) {
			playerVelY = -effectiveSpeed;
		}
	}

	display() {
		fill(255, 0, 0);
		noStroke();
		rectMode(CENTER);
		rect(this.x, this.y, this.size, this.size);
	}
}
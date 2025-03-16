class Player {
	constructor() {
		this.size = 30;
		this.x = width / 2;
		this.y = height / 2;
	}

	update() {
		playerVelY = 0;

		if (
			keyIsDown(LEFT_ARROW) &&
			this.x - this.size / 2 > width / 2 - laneWidth / 2
		) {
			this.x -= playerSpeed;
		}
		if (
			keyIsDown(RIGHT_ARROW) &&
			this.x + this.size / 2 < width / 2 + laneWidth / 2
		) {
			this.x += playerSpeed;
		}
		if (keyIsDown(UP_ARROW)) {
			playerVelY = playerSpeed;
		}
		if (keyIsDown(DOWN_ARROW)) {
			playerVelY = -playerSpeed;
		}
	}

    display() {
		fill(255, 0, 0);
		noStroke();
		rectMode(CENTER);
		rect(this.x, this.y, this.size, this.size);
	}
}
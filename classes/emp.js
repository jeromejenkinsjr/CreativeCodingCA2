class EMPWave {
	constructor(x, y) {
		this.position = createVector(x, y);
		this.radius = 1;
		this.maxRadius = 300;
		this.intensity = 1;
		this.decay = 0.03;
	}

	update() {
		this.radius += 10;
		this.intensity *= exp(-this.decay);
		if (this.radius > this.maxRadius || this.intensity < 0.01) {
			EMP_ACTIVE = false;
		}
	}

	display() {
		push();
		noFill();
		stroke(0, 255, 255, 200 * this.intensity);
		strokeWeight(2);
		ellipse(this.position.x, this.position.y, this.radius * 2);
		pop();
	}

	affects(player) {
		let d = dist(this.position.x, this.position.y, player.x, player.y);
		return d < this.radius;
	}
}
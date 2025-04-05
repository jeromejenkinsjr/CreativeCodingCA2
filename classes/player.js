class Player {
	constructor() {
		this.size = 30;
		this.x = width / 4;
		this.y = height / 3;
		this.weight = 3;
		this.rotation = 0;
	}

	update() {
		let effectiveSpeed = playerSpeed / this.weight;
		scrollSpeed = 0;

		if (keyIsDown(65) && this.x - this.size / 2 > width / 2 - laneWidth / 2) {
			this.x -= effectiveSpeed;
		}
		if (keyIsDown(68) && this.x + this.size / 2 < width / 2 + laneWidth / 2) {
			this.x += effectiveSpeed;
		}
		if (keyIsDown(87)) {
			scrollSpeed = effectiveSpeed;
		}
		if (keyIsDown(83)) {
			scrollSpeed = -effectiveSpeed;
		}

		let targetAngle = atan2(mouseY - this.y, mouseX - this.x);
		let baseTurnSpeed = 0.05;
		let effectiveTurnSpeed = baseTurnSpeed / (1 + (this.weight - 1) * 0.1);
		this.rotation = lerpAngle(this.rotation, targetAngle, effectiveTurnSpeed);
	}

	display() {
		push();
		translate(this.x, this.y);
		rotate(this.rotation);

		fill(255, 0, 0);
		noStroke();
		rectMode(CENTER);
		rect(0, 0, this.size, this.size);

		fill(0);
		noStroke();
		arc(10, 0, this.size, this.size, -QUARTER_PI, QUARTER_PI);
		pop();
	}

	applyEMPEffect(emp) {
		let d = dist(this.x, this.y, emp.position.x, emp.position.y);
		let strength = map(d, 0, emp.radius, 1, 0);
		strength = constrain(strength, 0, 1);

		this.weight = 3 + 2 * strength;
		this.rotation += random(-0.05, 0.05) * strength;

		let push = p5.Vector.sub(createVector(this.x, this.y), emp.position)
			.normalize()
			.mult(strength * 2);

		this.x += push.x;
		this.y += push.y;
	}
}

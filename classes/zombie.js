class Zombie {
	constructor(player) {
		this.size = 30;
		this.speed = random(0.5, 1);
		this.color = color(100, random(100, 200), 100);

		let edge = floor(random(4));
		switch (edge) {
			case 0:
				this.pos = createVector(random(width), -this.size);
				break;
			case 1:
				this.pos = createVector(random(width), height + this.size);
				break;
			case 2:
				this.pos = createVector(-this.size, random(height));
				break;
			case 3:
				this.pos = createVector(width + this.size, random(height));
				break;
		}

		this.target = createVector(player.x, player.y);
		this.vel = p5.Vector.sub(this.target, this.pos).normalize().mult(this.speed);
		this.alive = true;
	}

	update(player) {
		let direction = p5.Vector.sub(createVector(player.x, player.y), this.pos).normalize();
		this.vel = direction.mult(this.speed);
		this.pos.add(this.vel);
	}

	display() {
		push();
		fill(this.color);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.size);
		pop();
	}
}

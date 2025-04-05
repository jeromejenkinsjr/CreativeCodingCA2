class Laser {
	constructor(position, angle) {
		this.pos = position.copy(); // Starting position of laser is the user position, but we copy it so that it does not stay on the user's position.
		this.vel = p5.Vector.fromAngle(angle).mult(10); // Direction and speed
		this.radius = 4; // Will be used for laser collision with enemies
		this.alive = true;
	}

	update() {
		this.pos.add(this.vel);
		if (
			this.pos.x < 0 ||
			this.pos.x > width ||
			this.pos.y < 0 ||
			this.pos.y > height
		) {
			this.alive = false;
		}
	}

	display() {
		push();
		stroke(0, 255, 0);
		strokeWeight(3);

		let end = p5.Vector.add(
			this.pos,
			p5.Vector.mult(this.vel.copy().normalize(), 10)
		);
		line(this.pos.x, this.pos.y, end.x, end.y);
		pop();
	}

    hits(zombie) {
        return dist(this.pos.x, this.pos.y, zombie.pos.x, zombie.pos.y) < zombie.size / 2;
    }
}
class Player {
	constructor(x, y, xMax, yMax, props={}) {
		this.x = x;
		this.y = y;
		this.xMax = xMax;
		this.yMax = yMax;
		this.radius = props.hasOwnProperty("radius") ? props.radius : 1;
		this.colour = props.hasOwnProperty("colour") ? props.colour : "#FF0000";
		this.heading = props.hasOwnProperty("startingHeading") ? props.startingHeading : (-(Math.PI / 2));
		this.stepSize = props.hasOwnProperty("stepSize") ? props.stepSize : 1;
		this.turnRate = props.hasOwnProperty("turnRate") ? props.turnRate : (Math.PI/16);
		this.moveListener = this.moveWASD(this, this.stepSize, this.turnRate);
	}

	move(dx_rel=0, dy_rel=0, dh=0) {
		this.heading += dh;
		let dx = (Math.cos(this.heading - (Math.PI/2)) * dx_rel) + (Math.cos(this.heading) * dy_rel);
		let dy = (Math.sin(this.heading - (Math.PI/2)) * dx_rel) + (Math.sin(this.heading) * dy_rel);
		this.x += dx;
		this.y += dy;
	}

	moveWASD(self, dxy=1, dh=1) {
		return (event) => {
			if (event.keyCode === 87) {
				// W
				self.move(0, dxy, 0);
			} else if (event.keyCode === 83) {
				// S
				self.move(0, -dxy, 0);
			} else if (event.keyCode === 65) {
				// A
				self.move(dxy, 0, 0);
			} else if (event.keyCode === 68) {
				// D
				self.move(-dxy, 0, 0);
			} else if (event.keyCode === 81) {
				// Q
				self.move(0, 0, -dh);
			} else if (event.keyCode === 69) {
				// E
				self.move(0, 0, dh);
			}
		};
	}

	enableMovement() {
		window.addEventListener("keydown", this.moveListener);
	}

	disableMovement() {
		window.removeEventListener("keydown", this.moveListener);
	}
}

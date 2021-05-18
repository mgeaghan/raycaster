class RaycasterMap {
	constructor(canvas_id, props) {
		const self = this;
		this.width = props.hasOwnProperty("width") ? Math.ceil(props.width) : 96;
		this.height = props.hasOwnProperty("height") ? Math.ceil(props.height) : 54;
		if (this.width < 10) {
			this.width = 10;
		}
		if (this.height < 10) {
			this.height = 10;
		}
		this.scale = props.hasOwnProperty("scale") ? Math.ceil(props.scale) : 1;
		if (this.scale < 1) {
			this.scale = 1;
		}
		this.canvas = document.getElementById(canvas_id);
		this.canvas.width = this.width * this.scale;
		this.canvas.height = this.height * this.scale;
		this.rect = this.canvas.getBoundingClientRect();
		this.ctx = this.canvas.getContext("2d");
		this.map = this.initMap(this.width, this.height);
		this.fillColour = props.hasOwnProperty("fillColour") ? props.fillColour : "#343332";
		this.noFillColour = props.hasOwnProperty("noFillColour") ? props.noFillColour : "#d8dee1";
		this.strokeColour = props.hasOwnProperty("strokeColour") ? props.strokeColour : "#c8ced1";
		this.lastUpdate = undefined;
		this.frameInterval = props.hasOwnProperty("frameInterval") ? props.frameInterval : 25;
	}

	initMap(width, height) {
		let map = []
		for (let i = 0; i < height; i++) {
			map.push([])
			for (let j = 0; j < width; j++) {
				map[i].push(
					(i == 0 || j == 0 || i == (height - 1) || j == (width - 1)) ? true : false
				);
			}
		}
		return map;
	}

	drawMap() {
		for (let i = 0; i < this.height; i++) {
			let rectStartY = i * this.scale;
			for (let j = 0; j < this.width; j++) {
				let rectStartX = j * this.scale
				if (this.map[i][j]) {
					this.ctx.fillStyle = this.fillColour;
					this.ctx.fillRect(rectStartX, rectStartY, this.scale, this.scale);
				} else {
					this.ctx.fillStyle = this.noFillColour;
				}
				this.ctx.strokeStyle = this.strokeColour;
				this.ctx.lineWidth = 1;
				this.ctx.strokeRect(rectStartX, rectStartY, this.scale, this.scale);
			}
		}
	}

	fillSquare(x, y) {
		this.map[y][x] = true;
	}

	clearSquare(x, y) {
		this.map[y][x] = false;
	}

	trackMouse(self) {
		return (event) => {
			let xPos = Math.floor((event.clientX - self.rect.left) / self.scale);
			let yPos = Math.floor((event.clientY - self.rect.top) / self.scale);
			self.fillSquare(xPos, yPos);
		}
	}

	drawLoop(timestamp) {
		if (this.lastUpdate === undefined) {
			this.lastUpdate = timestamp;
		}
		const elapsed = timestamp - this.lastUpdate;
		if (elapsed > this.frameInterval) {
			this.drawMap();
		}
		requestAnimationFrame(timestamp => this.drawLoop(timestamp));
	}

	enableDrawing() {
		let trackMouse = this.trackMouse(this);
		this.canvas.addEventListener("mousedown", (event) => {
			trackMouse(event);
			this.canvas.addEventListener("mousemove", trackMouse);
		});
		this.canvas.addEventListener("mouseup", () => {
			this.canvas.removeEventListener("mousemove", trackMouse);
		});
		requestAnimationFrame(timestamp => this.drawLoop(timestamp));
	}
}

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
		this.mapGhost = this.initMapGhost(this.width, this.height);
		this.fillColour = props.hasOwnProperty("fillColour") ? props.fillColour : "#343332";
		this.ghostFillColour = props.hasOwnProperty("ghostFillColour") ? props.ghostFillColour : "#34333231";
		this.ghostRadius = props.hasOwnProperty("ghostRadius") ? props.ghostRadius : 2;
		this.keepBorder = props.hasOwnProperty("keepBorder") ? props.keepBorder : true;
		this.trackMouseDraw = this.trackMouse(this, this.ghostRadius, false, false, this.keepBorder);
		this.trackMouseClear = this.trackMouse(this, this.ghostRadius, false, true, this.keepBorder);
		this.trackMouseGhost = this.trackMouse(this, this.ghostRadius, true, false, this.keepBorder);
		this.noFillColour = props.hasOwnProperty("noFillColour") ? props.noFillColour : "#d8dee1";
		this.strokeColour = props.hasOwnProperty("strokeColour") ? props.strokeColour : "#c8ced1";
		this.lastUpdate = undefined;
		this.frameInterval = props.hasOwnProperty("frameInterval") ? props.frameInterval : 1000;
		this.canvas.oncontextmenu = (event) => {
			event.preventDefault();
		}
	}

	initMap(width, height) {
		let map = [];
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

	initMapGhost(width, height) {
		let map = [];
		for (let i = 0; i < height; i++) {
			map.push([])
			for (let j = 0; j < width; j++) {
				map[i].push(false);
			}
		}
		return map;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawMap() {
		for (let i = 0; i < this.height; i++) {
			let rectStartY = i * this.scale;
			for (let j = 0; j < this.width; j++) {
				let rectStartX = j * this.scale
				if (this.map[i][j]) {
					this.ctx.fillStyle = this.fillColour;
					this.ctx.fillRect(rectStartX, rectStartY, this.scale, this.scale);
				} else if (this.mapGhost[i][j]) {
					this.ctx.fillStyle = this.ghostFillColour;
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

	fillSquare(x, y, radius=0, ghost=false, clear=false, keepBorder=true) {
		let map = ghost ? this.mapGhost : this.map;
		let r = Math.floor(Math.max(radius, 0));
		if (r === 0) {
			if (y == 0 || x == 0 || y == (this.height - 1) || x == (this.width - 1)) {
				map[y][x] = keepBorder ? true : (clear ? false : true);
			} else {
				map[y][x] = clear ? false : true;
			}
		} else {
			let xMin = Math.max(x - r, 0);
			let xMax = Math.min(x + r, this.width - 1);
			let yMin = Math.max(y - r, 0);
			let yMax = Math.min(y + r, this.height - 1);
			for (let i = yMin; yMin <= i && i <= yMax; i++) {
				for (let j = xMin; xMin <= j && j <= xMax; j++) {
					if (Math.sqrt(((i - y) ** 2) + ((j - x) ** 2)) <= r) {
						if (i == 0 || j == 0 || i == (this.height - 1) || j == (this.width - 1)) {
							map[i][j] = keepBorder ? true : (clear ? false : true);
						} else {
							map[i][j] = clear ? false : true;
						}
					}
				}
			}
		}
	}

	clearMapGhost() {
		this.mapGhost = this.initMapGhost(this.width, this.height);
	}

	getXYPos(self, event) {
		let xPos = Math.floor((event.clientX - self.rect.left) / self.scale);
		let yPos = Math.floor((event.clientY - self.rect.top) / self.scale);
		if (xPos < 0) {
			xPos = 0;
		} else if (xPos >= self.width) {
			xPos = self.width - 1;
		}
		if (yPos < 0) {
			yPos = 0;
		} else if (yPos >= self.height) {
			yPos = self.height - 1;
		}
		return [xPos, yPos];
	}

	trackMouse(self, radius=0, ghost=false, clear=false, keepBorder=true) {
		return (event) => {
			let xyPos = self.getXYPos(self, event);
			let xPos = xyPos[0];
			let yPos = xyPos[1];
			self.clearMapGhost();
			self.fillSquare(xPos, yPos, radius, ghost, clear, keepBorder);
		}
	}

	drawLoop(timestamp) {
		if (this.lastUpdate === undefined) {
			this.lastUpdate = timestamp;
		}
		const elapsed = timestamp - this.lastUpdate;
		if (elapsed > this.frameInterval) {
			this.clear();
			this.drawMap();
		}
		requestAnimationFrame(timestamp => this.drawLoop(timestamp));
	}

	setDrawMode(enabled=false) {
		if (enabled) {
			this.canvas.addEventListener("mousemove", this.trackMouseGhost);
			this.canvas.addEventListener("mousedown", (event) => {
				// this.canvas.removeEventListener("mousemove", trackMouseGhost);
				let clear = false;
				if (event.button !== 0) {
					clear = true;
				}
				if (clear) {
					this.trackMouseClear(event);
					this.canvas.addEventListener("mousemove", this.trackMouseClear);
				} else {
					this.trackMouseDraw(event);
					this.canvas.addEventListener("mousemove", this.trackMouseDraw);
				}
			});
			this.canvas.addEventListener("mouseup", (event) => {
				let clear = false;
				if (event.button !== 0) {
					clear = true;
				}
				if (clear) {
					this.canvas.removeEventListener("mousemove", this.trackMouseClear);
				} else {
					this.canvas.removeEventListener("mousemove", this.trackMouseDraw);
				}
				// this.canvas.addEventListener("mousemove", trackMouseGhost);
			});
		} else {
			this.clearMapGhost();
			this.canvas.removeEventListener("mousemove", this.trackMouseGhost);
			this.canvas.removeEventListener("mousemove", this.trackMouseClear);
			this.canvas.removeEventListener("mousemove", this.trackMouseDraw);
		}
		requestAnimationFrame(timestamp => this.drawLoop(timestamp));
	}
}

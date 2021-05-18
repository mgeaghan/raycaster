class RaycasterMap {
	constructor(canvas_id, props) {
		this.width = props.hasOwnProperty("width") ? props.width : 192;
		this.height = props.hasOwnProperty("height") ? props.height : 108;
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
		this.ctx = this.canvas.getContext("2d");
		this.map = this.init_map(this.width, this.height);
		this.fillColour = props.hasOwnProperty("fillColour") ? props.fillColour : "#343332";
	}

	init_map(width, height) {
		let map = []
		for (let i = 0; i < height; i++) {
			map.push([])
			for (let j = 0; j < width; j++) {
				map[i].push(
					(i == 0 || j == 0 || i == (height - 1) || j == (width - 1)) ? 1 : 0
				);
			}
		}
		return map;
	}

	draw_map() {
		for (let i in this.map) {
			for (let j in this.map[i]) {
				if (this.map[i][j] == 1) {
					let rectStartX = j * this.scale
					let rectStartY = i * this.scale;
					let rectEndX = (j + 1) * this.scale;
					let rectEndY = (i + 1) * this.scale;
					this.ctx.fillStyle = this.fillColour;
					this.ctx.fillRect(rectStartX, rectStartY, rectEndX, rectEndY);
				}
			}
		}
	}
}

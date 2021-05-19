class RaycasterFPS {
	constructor(canvas_id, props={}) {
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
	}
}

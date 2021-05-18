class RaycasterTopdown {
	constructor(canvas_id, props) {
		this.width = props.hasOwnProperty("width") ? props.width : 960;
		this.height = props.hasOwnProperty("height") ? props.height : 540;
		this.canvas = document.getElementById(canvas_id);
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext("2d");
	}
}

class Player {
	constructor(x, y, xMax, yMax, props={}) {
		this.x = x;
		this.y = y;
		this.xMax = xMax;
		this.yMax = yMax;
		this.radius = props.hasOwnProperty("radius") ? props.radius : 4;
		this.colour = props.hasOwnProperty("colour") ? props.colour : "#FF0000";
		this.heading = props.hasOwnProperty("startingHeading") ? props.startingHeading : (-(Math.PI / 2));
	}
}

class Raycaster {

}

// CONTROLS
let draw_mode = document.getElementById("draw-mode");
// END CONTROLS

// FPS
let rc_fps = new RaycasterFPS("raycaster-fps-canvas", {
	scale: 8,
	roofColour: [150, 150, 150],
	floorColour: [52, 51, 50],
});
// END FPS

// MAP
let rc_map = new RaycasterMap("raycaster-map-canvas", {
	scale: 8,
	drawCollisions: true,
	drawRays: true,
});
rc_map.drawMap();
rc_map.setDrawMode(draw_mode.checked);
draw_mode.onclick = () => {
	rc_map.setDrawMode(draw_mode.checked);
}
// END MAP

// PLAYER
let player = new Player(8, 8, rc_map.width, rc_map.height, {
	collisionNPoints: 4,
	collisionRadius: 2,
	map: rc_map.map,
	fov: (Math.PI / 3),
	nrays: 96,
	dov: 150,
});
player.enableMovement();
player.setCollisions(true);
// END PLAYER

rc_map.setPlayer(player);
rc_fps.setPlayer(player);
rc_fps.startDrawLoop();

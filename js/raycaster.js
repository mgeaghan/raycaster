class Raycaster {

}

// CONTROLS
let draw_mode = document.getElementById("draw-mode");
// END CONTROLS

// FPS
let rc_fps = new RaycasterFPS("raycaster-fps-canvas", {
	scale: 8,
});
// END FPS

// MAP
let rc_map = new RaycasterMap("raycaster-map-canvas", {
	scale: 8,
});
rc_map.drawMap();
rc_map.setDrawMode(draw_mode.checked);
draw_mode.onclick = () => {
	rc_map.setDrawMode(draw_mode.checked);
}
// END MAP

// PLAYER
let player = new Player(8, 8, rc_map.width, rc_map.height);
player.enableMovement();
// END PLAYER

rc_map.setPlayer(player);

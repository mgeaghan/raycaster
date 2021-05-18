class Raycaster {

}

// CONTROLS
let draw_mode = document.getElementById("draw-mode");
// END CONTROLS

// MAP
let rc_map = new RaycasterMap("raycaster-map-canvas", {
	scale: 8,
});
rc_map.drawMap();
rc_map.setDrawMode(draw_mode.checked, 2, true);
draw_mode.onclick = () => {
	rc_map.setDrawMode(draw_mode.checked, 2, true);
}
// END MAP

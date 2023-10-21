function onResults(results) {
	// Draw the overlays.
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
	if (results.detections.length > 0) {
		drawingUtils.drawRectangle(
			ctx, results.detections[0].boundingBox,
			{color: 'blue', lineWidth: 4, fillColor: '#00000000'});
		drawingUtils.drawLandmarks(ctx, results.detections[0].landmarks, {
			color: 'red',
			radius: 5,
		});
	}
	ctx.restore();
}

const faceDetection = new FaceDetection({locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`;
	}});
faceDetection.setOptions({
	modelSelection: 0,
	minDetectionConfidence: 0.5
});
faceDetection.onResults(onResults);

video.addEventListener('play', function () {
	var $this = this; //cache
	// $this.currentTime = 320 // good 3 person view
	// $this.currentTime = 520 // end
	faceDetection.onResults(onResults);
	async function loop(results) {
		if (!$this.paused && !$this.ended) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage($this, 0, 0);
			await faceDetection.send({image: video}); // this needs to be a piece of the video not the whole thing a frame
			setTimeout(loop, 1000 / 30); // drawing at 30fps
		}
	}
	loop()
})
document.addEventListener('click', function () {
	if(playStop){

		video.play()
	} else {
		video.pause()
	}
	playStop = !playStop
})
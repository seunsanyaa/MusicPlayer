let audioContext;
let gainNode;
let audioBuffer;
let started = false;

export const mousePressed = (song) => {
	return playSound(song);
};
export const loadSound = async ({ song, audioContext }) => {
	// Re-use the audio buffer as a source
	if (!audioBuffer) {
		// Fetch MP3 from URL
		const resp = await fetch(song);

		// Turn into an array buffer of raw binary data
		const buf = await resp.arrayBuffer();

		// Decode the entire binary MP3 into an AudioBuffer
		audioBuffer = await audioContext.decodeAudioData(buf);

		return audioBuffer;
	}

	// Re-use the same context if it exists
	// if (!audioContext) {
	// 	audioContext = new AudioContext();
	//
	// 	// Re-use the audio buffer as a source
	// 	if (!audioBuffer) {
	// 		// Fetch MP3 from URL
	// 		const resp = await fetch(song);
	//
	// 		// Turn into an array buffer of raw binary data
	// 		const buf = await resp.arrayBuffer();
	//
	// 		// Decode the entire binary MP3 into an AudioBuffer
	// 		audioBuffer = await audioContext.decodeAudioData(buf);
	//
	// 		console.log(audioBuffer);
	// 	}
	// }
};

export const playSound = async ({ song, audioContext }) => {
	// Snsure we are all loaded up
	console.log(audioContext);

	if (true) {
		const songBuffer = await loadSound({ song, audioContext });

		// Ensure we are in a resumed state
		await audioContext.resume();

		// Now create a new "Buffer Source" node for playing AudioBuffers
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;

		gainNode = audioContext.createGain();

		// Connect the source node to the gain node

		source.connect(gainNode);
		// Connect to destination
		gainNode.connect(audioContext.destination);

		// Assign the loaded buffer

		console.log('start song');
		// Start (zero = play immediately)
		source.start(0);

		started = true;
		return songBuffer;
	}

	// return `${Math.floor(audioBuffer?.duration / 60)}:${Math.floor(
	// 	audioBuffer?.duration % 60
	// )}`;
};

export const muteSound = async () => {
	if (gainNode.gain.value != 0) {
		gainNode.gain.value = 0;
	} else {
		gainNode.gain.value = 1;
	}
};
export const songDuration = async ({ audioContext }) => {
	let currentTime = Math.floor(audioContext?.currentTime);

	if (currentTime % 60 < 10) {
		return `${Math.floor(currentTime / 60)}:0${currentTime % 60}
			`;
	} else {
		return `${Math.floor(currentTime / 60)}:${currentTime % 60}
		`;
	}
};

export const waveTimer = async ({ audioContext }) => {
	return Math.floor(audioContext?.currentTime);
};

export const totalWaveTimer = async () => {
	return Math.floor(audioBuffer?.duration);
};

export const stopSound = async ({ audioContext }) => {
	if (!started) {
		await audioContext?.stop();
	}
};

export const totalDurations = async () => {
	// return(
	// 		Math.floor(audioBuffer?.duration / 60),
	// 		Math.floor(audioBuffer?.duration % 60)
	// 	);
	console.log(1);
};

const audioCtx =  new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequencies = [440], duration = 2) {
        // Ensure frequencies is an array
        if (!Array.isArray(frequencies)) {
            frequencies = [frequencies]; 
        }
        frequencies.forEach(frequency => {
        const osc = audioCtx.createOscillator();
        const envelope = audioCtx.createGain();

        osc.connect(envelope);
        envelope.connect(audioCtx.destination);

        // Smoothly adjust the gain (volume) over time
        envelope.gain.setValueAtTime(0, audioCtx.currentTime);
        envelope.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        envelope.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    });
}
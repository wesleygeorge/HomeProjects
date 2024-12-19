const audioCtx =  new (window.AudioContext || window.webkitAudioContext)();

function playsound(frequency = 440, duration = 2) {
    const osc = audioCtx.createOscillator();
    const envelope = audioCtx.createGain();
    osc.connect(envelope);
    envelope.connect(audioCtx.destination);

    //change the gain over time for each beep to make it sound nicer
    envelope.gain.setValueAtTime(0, audioCtx.currentTime);
    envelope.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + .05);
    envelope.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}
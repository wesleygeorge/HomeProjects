const size = 700;
const myCanvas = document.getElementById("myCanvas");
myCanvas.width = size;
myCanvas.height = size / 2;

const trackCenter = { x: size / 2, y: size / 2 };
const trackMinRadius = 50;
const trackStep = 15;
const ballRadius = 5;
const ballMinSpeed = 0.01;
const ballStep = -0.0001;

// Sound variation
const soundFrequencies = [
    1760, 1567.98, 1396.91, 1318.51, 1174.66, 1046.5, 987.77, 880,
    783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440, 392, 349.23,
    329.63, 293.66, 261.63
];

// Making multiple track and ball pairs
const tracks = [];
const balls = [];
const pairs = 20;

for (let i = 0; i < pairs; i++) {
    const trackRadius = trackMinRadius + i * trackStep;
    const ballSpeed = ballMinSpeed + i * ballStep;
    const hue = (i * 360) / pairs;
    const ballSoundFrequency = soundFrequencies[i];
    const track = new Track(trackCenter, trackRadius, hue);
    const ball = new Ball(track, ballRadius, ballSpeed, ballSoundFrequency, hue);
    tracks.push(track);
    balls.push(ball);
}

const ctx = myCanvas.getContext("2d");

animate();

function animate() {
    ctx.clearRect(0, 0, size, size);
    tracks.forEach((track) => track.draw(ctx));
    balls.forEach((ball) => ball.move(ctx));
    balls.forEach((ball) => ball.draw(ctx));
    requestAnimationFrame(animate);
}
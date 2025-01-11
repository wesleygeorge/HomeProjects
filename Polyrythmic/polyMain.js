//Making canvas
const size = 700;
let canvasHeight = 2;
const myCanvas = document.getElementById("myCanvas");
myCanvas.width = size;
myCanvas.height = size / canvasHeight;

//Making track and ball variables
const trackCenter = { x: size / 2, y: size / 2 };
const trackMinRadius = 50;
const trackStep = 15;
const ballRadius = 5;
const ballMinSpeed = 0.01;
const ballStep = -0.0001;
let goDiscoActive = false;
let discoAnimationID;


// Sound variation
const soundFrequencies = [
    1760, 1567.98, 1396.91, 1318.51, 1174.66, 1046.5, 987.77, 880,
    783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440, 392, 349.23,
    329.63, 293.66, 261.63
];

const intervals = {
    fifth: 1.5,  // The fifth is a 3:2 ratio
    octave: 2,   // The octave is a 2:1 ratio
    thirdMajor: 1.26,  // Major third is roughly a 5:4 ratio
    thirdMinor: 1.2,   // Minor third is roughly a 6:5 ratio
    seventh: 1.87,  // Dominant seventh is roughly a 7:4 ratio
    ninth: 2.0,     // Ninth is roughly a 9:4 ratio
    eleventh: 2.5,  // Eleventh is roughly a 5:2 ratio
    thirteenth: 3.0 // Thirteenth is roughly a 3:1 ratio
};

function createHarmonicLayers(soundFrequencies) {
    const twoToneLayers = [];
    const threeToneLayers = [];
    const fourToneLayers = [];
    const fiveToneLayers = [];
    soundFrequencies.forEach(frequency => {
        twoToneLayers.push([frequency, frequency * intervals.fifth, frequency * intervals.octave]);
        threeToneLayers.push([frequency, frequency * intervals.thirdMajor, frequency * intervals.fifth]);
        fourToneLayers.push([frequency, frequency * intervals.thirdMajor, frequency * intervals.fifth, frequency * intervals.seventh]);
        fiveToneLayers.push([frequency, frequency * intervals.thirdMajor, frequency * intervals.fifth, frequency * intervals.seventh, frequency * intervals.ninth]);
    }); 
    return {
        twoToneLayers,
        threeToneLayers,
        fourToneLayers,
        fiveToneLayers
    };
}

const harmonicLayers = createHarmonicLayers(soundFrequencies);

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

// //Initializing buttons
// Attach event listeners
document.getElementById("colorButton1").addEventListener("click", changeTrackHue);
document.getElementById("colorButton2").addEventListener("click", changeBallHue);
document.getElementById("colorButton3").addEventListener("click", toggleDisco);
document.getElementById("speedButton1").addEventListener("click", ballFaster);
document.getElementById("speedButton2").addEventListener("click", ballSlower);
document.getElementById("speedButton3").addEventListener("click", resetBallSpeed);
document.getElementById("soundButton1").addEventListener("click", function() {changeTone(harmonicLayers.twoToneLayers);});
document.getElementById("soundButton2").addEventListener("click", function() {changeTone(harmonicLayers.threeToneLayers);});
document.getElementById("soundButton3").addEventListener("click", function() {changeTone(harmonicLayers.fourToneLayers)});
document.getElementById("soundButton4").addEventListener("click", function() {changeTone(harmonicLayers.fiveToneLayers)});
document.getElementById("soundButton5").addEventListener("click", resetTone);
//I have to get the sin, cos and phase values and send them to reset the tracks. How do I only send the value for each one without having to send the one for the others?
document.getElementById("sinFrequency").addEventListener("input", (event) => {
    resetSinFrequency(event.target.value);
});
document.getElementById("cosFrequency").addEventListener("input", (event) => {
    resetCosFrequency(event.target.value);
});
document.getElementById("phaseShift").addEventListener("input", (event) => {
    console.log(parseInt(event.target.value));
    resetPhaseShift(parseInt(event.target.value));
});


animate();


//Functions
function animate() {
    ctx.clearRect(0, 0, size, size);
    tracks.forEach((track) => track.draw(ctx));
    balls.forEach((ball) => ball.move(ctx));
    balls.forEach((ball) => ball.draw(ctx));
    requestAnimationFrame(animate);
}

//Color functions
function changeTrackHue() {
    tracks.forEach((track) => {
        track.hue = Math.floor(Math.random() * 360);
});

}
function changeBallHue() {
    balls.forEach((ball) => {
        ball.hue = Math.floor(Math.random() * 360);
});
}

function goDisco() {
        if(!goDiscoActive) return;
        
        changeTrackHue();
        changeBallHue();
        setTimeout(() => {
            discoAnimationID = requestAnimationFrame(goDisco);
        }, 80);
    }

function toggleDisco() {
    if(goDiscoActive) {
        goDiscoActive = false;
        cancelAnimationFrame(discoAnimationID);
        colorButton3.innerText = "Go Disco";
    } else {
        goDiscoActive = true;
        goDisco();
        colorButton3.innerText = "Stop Disco";

    }
}

function stopDisco() {
    goDiscoActive = false;
    cancelAnimationFrame(discoAnimationID);
}

//Speed functions
function ballFaster() {
    balls.forEach((ball) => {
        ball.speed += .005;
});
}

function ballSlower() {
    balls.forEach((ball) => {
        ball.speed -= .005;
});
}

function resetBallSpeed() {
    balls.forEach((ball) => {
        ball.speed = .01;
});
}

//Sound functions
function changeTone(layerName) {
    balls.forEach((ball, index) => {
        ball.soundFrequency = layerName[index % layerName.length];
            console.log("This is the ball's frequency " + ball.soundFrequency);
    });
}

function resetTone() {
    balls.forEach((ball, index) => {
        ball.soundFrequency = soundFrequencies[index % soundFrequencies.length];
        console.log("This is the ball's frequency " + ball.soundFrequency);
    });
}

//Shape functions
function resetSinFrequency(sinFrequency) {
    tracks.forEach((track) => {
        track.sinFrequency = sinFrequency;
        console.log("This is the track's new sin frequency " + track.sinFrequency);
    });
}

function resetCosFrequency(cosFrequency) {
    tracks.forEach((track) => {
        track.cosFrequency = cosFrequency;
        console.log("This is the track's new cos frequency " + track.cosFrequency);
    });
}

function resetPhaseShift(phaseShift) {
    switch(phaseShift) {
        case 0:
            tracks.forEach((track) => {
            track.phaseShift = 0;
            console.log("This is the track's new phase shift " + track.phaseShift);
            });
            break;
        case 1:
            tracks.forEach((track) => {
            track.phaseShift = Math.PI / 4;
            console.log("This is the track's new phase shift " + track.phaseShift);
            });
            break;
        case 2:
            tracks.forEach((track) => {
            track.phaseShift = Math.PI / 2;
            console.log("This is the track's new phase shift " + track.phaseShift);
            });
            break;
        case 3:
            tracks.forEach((track) => {
            track.phaseShift = (3 * Math.PI) / 4;
            console.log("This is the track's new phase shift " + track.phaseShift);
            });
            break;
        case 4:
            tracks.forEach((track) => {
            track.phaseShift = Math.PI;
            console.log("This is the track's new phase shift " + track.phaseShift);
            });
            break;
        default:
            console.error("Invalid slider value");
    }
}
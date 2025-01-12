class Track {
    constructor(center, radius, hue, cosFrequency = 1, sinFrequency = 1, phaseShift = 0) {
        this.center = center;
        this.radius = radius;
        this.cosFrequency = cosFrequency;
        this.sinFrequency = sinFrequency;
        this.phaseShift = phaseShift;
        this.period = Math.PI;
        this.hue = hue;
    }

    getPosition(offset) {
        return {
            x: this.center.x + Math.cos(offset * this.cosFrequency) * this.radius,
            y: this.center.y - Math.abs(Math.sin(offset * this.sinFrequency + this.phaseShift) * this.radius),
            //To switch to full screen mode (have to amend canvasHeight, as well)
            //y: this.center.y - Math.sin(offset * this.sinFrequency + this.phaseShift) * this.radius,
            round: Math.floor(offset / this.period),
            progress: (offset % this.period) / this.period
        };
    }

    draw(ctx) {
        ctx.beginPath();
        for (let offset = 0; offset < Math.PI * 2; offset += .01) {
            const pos = this.getPosition(offset, this.cosFrequency, this.sinFrequency);
            ctx.lineTo(pos.x, pos.y);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Ball {
    constructor(track, radius, speed, soundFrequency, hue) {
        this.track = track;
        this.radius = radius;
        this.hue = hue;
        this.speed = speed;
        this.soundFrequency = soundFrequency;
        this.offset = 0;
        this.round = 0;
        this.progress = 0;
        this.center = this.track.getPosition(this.offset);
    }

    move() {
        this.offset += this.speed;
        const res = this.track.getPosition(this.offset);
        this.center = { x: res.x, y: res.y };
        this.progress = res.progress;
        const epsilon = 0.035; // Tolerance for comparison
        if(Math.abs(Math.sin(this.offset * this.track.sinFrequency + this.track.phaseShift)) < epsilon){
            playSound(this.soundFrequency);
        }
        //This is for the half circles and is exact, not requiring the tolerance epsilon to handle the float issues.
        // if (res.round != this.round) {
        //     playSound(this.soundFrequency);
        //     this.round = res.round;
        // }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        let lightness = 50;        
        if (this.progress >= 0 && this.progress < 0.075) {
            // Gradually decrease from 100 to 50 in the first 10% of the period
            lightness = 100 - 500 * this.progress;
        } else if (this.progress >= 0.075 && this.progress < 1) {
            // Stay at 50 for the rest of the period
            lightness = 50;
        } else if (this.progress === 1) {
            // At the very end of the period, set the value to 100
            lightness = 100;
        }
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${lightness}%)`;
        ctx.fill();
        ctx.stroke();
    }
}
class Track {
    constructor(center, radius, hue) {
        this.center = center;
        this.radius = radius;
        this.period = Math.PI;
        this.hue = hue;
    }

    getPosition(offset) {
        return {
            x: this.center.x + Math.cos(offset) * this.radius,
            y: this.center.y - Math.abs(Math.sin(offset) * this.radius),
            round: Math.floor(offset / this.period),
            progress: (offset % this.period) / this.period
        };
    }

    draw(ctx) {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += .01) {
            const pos = this.getPosition(a);
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

    // pickRandomSoundFreq() {
        //randomly pick from the array of sounds every time the ball hits the wall.        
    // }

    move() {
        this.offset += this.speed;
        const res = this.track.getPosition(this.offset);
        this.center = { x: res.x, y: res.y };
        this.progress = res.progress;
        if (res.round != this.round) {
            playsound(this.soundFrequency);
            this.round = res.round;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        let lightness = 50;
        if (this.progress >= 0 && this.progress < 0.1) {
            // Gradually decrease from 100 to 50 in the first 10% of the period
            lightness = 100 - 500 * this.progress;
        } else if (this.progress >= 0.1 && this.progress < 1) {
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
class SoundServiceImpl {
    constructor() {
        this.ctx = null;
        this.node = null;
        this.gain = null;
        this.alarmInterval = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    async play(type) {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        this.stop();

        if (type === 'success') return this.playSuccess();
        if (type === 'levelUp') return this.playLevelUp();
        if (type === 'alarm') return this.playAlarm();

        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.node = this.ctx.createBufferSource();
        this.node.buffer = buffer;
        this.node.loop = true;

        this.gain = this.ctx.createGain();
        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 1);

        const filter = this.ctx.createBiquadFilter();
        if (type === 'rain') {
            filter.type = 'lowpass';
            filter.frequency.value = 400;
        } else if (type === 'wind') {
            filter.type = 'bandpass';
            filter.frequency.value = 500;
            filter.Q.value = 1;
        } else if (type === 'forest') {
            filter.type = 'lowpass';
            filter.frequency.value = 800;
        }

        this.node.connect(filter);
        filter.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.node.start();
    }

    playSuccess() {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playLevelUp() {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
            g.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.1);
            g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + i * 0.1 + 0.05);
            g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + i * 0.1 + 0.4);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.1);
            osc.stop(this.ctx.currentTime + i * 0.1 + 0.5);
        });
    }

    playAlarm() {
        if (this.alarmInterval) return;

        const playTone = () => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.2);

            g.gain.setValueAtTime(0, this.ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
            g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.25);

            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        };

        playTone();
        this.alarmInterval = setInterval(playTone, 1000);
    }

    stopAlarm() {
        if (this.alarmInterval) {
            clearInterval(this.alarmInterval);
            this.alarmInterval = null;
        }
    }

    stop() {
        if (this.gain) {
            this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
            const oldNode = this.node;
            setTimeout(() => {
                if (oldNode) {
                    try { oldNode.stop(); } catch (e) { }
                }
            }, 200);
            this.gain = null;
            this.node = null;
        }
    }
}

export const SoundService = new SoundServiceImpl();

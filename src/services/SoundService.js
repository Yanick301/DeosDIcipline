class SoundServiceImpl {
    constructor() {
        this.ctx = null;
        this.node = null;
        this.gain = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    async play(type) {
        this.stop();
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();

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

        // Simple filtering for different types
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
        } else {
            filter.type = 'lowpass';
            filter.frequency.value = 2000; // Brown/White noise-ish
        }

        this.node.connect(filter);
        filter.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.node.start();
    }

    stop() {
        if (this.gain) {
            this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
            setTimeout(() => {
                if (this.node) {
                    this.node.stop();
                    this.node = null;
                }
            }, 500);
        }
    }
}

export const SoundService = new SoundServiceImpl();

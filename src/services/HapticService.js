class HapticServiceImpl {
    constructor() {
        this.enabled = true;
    }

    vibrate(pattern) {
        if (!this.enabled || !('vibrate' in navigator)) return;
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.warn('Haptics failed', e);
        }
    }

    light() {
        this.vibrate(10);
    }

    medium() {
        this.vibrate(30);
    }

    impact() {
        this.vibrate([10, 30, 10]);
    }

    success() {
        this.vibrate([50, 100, 50, 100, 50]);
    }

    error() {
        this.vibrate([100, 50, 100]);
    }

    setEnabled(val) {
        this.enabled = val;
    }
}

export const HapticService = new HapticServiceImpl();

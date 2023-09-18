class IdleWorker {
    constructor() {
        this.id = -1;
        this.timeout = 60 * 1000;
        this.handler = undefined;
    }

    start() {
        this.stop();

        // call fisrt
        this.handler ? this.handler() : console.error('set handler first');

        this.id = setInterval(() => {
            this.handler ? this.handler() : console.error('set handler first');
        }, this.timeout);
    }

    reset() {
        this.stop();
        this.start();
    }

    stop() {
        clearTimeout(this.id);
    }

    setHandler(_handler) {
        this.handler = _handler;
    }
}

const idleWorker = new IdleWorker();

class AuthWorker {
    constructor() {
        this.id = -1;
        this.interval = 58 * 60 * 1000;
        this.handler = undefined;
    }

    start() {
        stop();

        // call first
        this.handler ? this.handler() : console.error('set handler first')

        this.id = setInterval(() => {
            this.handler ? this.handler() : console.error('set handler first')
        }, this.interval);
    }

    stop() {
        clearInterval(this.id);
    }

    setHandler(_handler) {
        this.handler = _handler;
    }
}

const authWorker = new AuthWorker();

export {
    authWorker,
    idleWorker,
};
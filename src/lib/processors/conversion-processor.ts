import { EventEmitter } from "events";

export abstract class ConversionProcessor extends EventEmitter {

    protected inputFile: string = ''

    constructor(inputFile: string) {
        super()
        this.inputFile = inputFile
    }

    process() {
        let counter = 100
        let intervalTimer = setInterval(() => {
            counter--
            if (counter === 0) {
                clearInterval(intervalTimer)
                this.emit('onComplete', 'OUTPUT')
                return;
            }
            this.emit('onProgress', 100 - counter)
        }, 1000)
    }

}
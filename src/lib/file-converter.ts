import { EventEmitter } from 'events'
import * as fs from 'fs'
import { 
    StepConversionProcessor, 
    IGESConversionProcessor, 
    STLConversionProcessor, 
    OBJConversionProcessor,
    ConversionProcessor
} from './processors'
import { fstat } from 'fs'

export type FileFormat = 'step' | 'iges' | 'stl' | 'obj'

export class FileConverter extends EventEmitter {
    
    private inputFile: string = ''
    private outputFile: string = ''
    private format: FileFormat = 'step'

    constructor(inputFile: string, format: FileFormat, outputFile: string) {
        super()
        this.inputFile = inputFile
        this.format = format
        this.outputFile = outputFile
    }

    public convert() {
        let originalFileContent = fs.readFileSync(this.inputFile)
        let processor: ConversionProcessor
        switch (this.format) {
            case 'step': {
                processor = new StepConversionProcessor(this.inputFile)
                break;
            }
            case 'iges': {
                processor = new IGESConversionProcessor(this.inputFile)
                break;
            }
            case 'obj': {
                processor = new OBJConversionProcessor(this.inputFile)
                break;
            }
            case 'stl': {
                processor = new STLConversionProcessor(this.inputFile)
                break;
            }
            default:
                throw new Error(`Format <${this.format}> is invalid`)
        }

        processor.on('onProgress', (percent: number) => {
            this.emit('onProgress', percent)
        })

        // TODO: write the real output to file
        processor.on('onComplete', (output: string | Buffer) => {
            this.writeFile(originalFileContent)
            this.emit('onComplete')
        })

        processor.process()
    }

    private writeFile(payload: string | Buffer): void {
        fs.writeFileSync(this.outputFile, payload)
    }

}
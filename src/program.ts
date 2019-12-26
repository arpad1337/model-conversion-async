import {
    FileFormat,
    FileConverter
} from './lib/file-converter'

import * as yargs from 'yargs'

interface Arguments {
    _: any;
    format: string
}

export default class Program {
    
    public static main(): void {
        const formats: ReadonlyArray<FileFormat> = ['iges','step','stl','obj']

        const argv: Arguments = yargs.option('format', {
            default: 'step',
            choices: formats,
            demandOption: true
        }).argv

        if (argv._.length < 2) {
            console.error('Missing input or output file path')
            this.exit(1)
        }
        
        const format = argv.format;
        const inputFile = argv._[0]
        const outputFile = argv._[argv._.length - 1]

        const fileConverter = new FileConverter(inputFile, format as FileFormat, outputFile)
        
        fileConverter.on('onProgress', this.reportProgress)
        fileConverter.on('onComplete', () => {
            this.reportCompletion()
            this.exit(0)
        })

        try {
            fileConverter.convert() 
        } catch(e) {
            console.error(`### ERROR: ${e.message}`)
            this.exit(1)
        }
    }

    private static reportProgress(progress: number): void {
        console.log(`### IN PROGRESS: ${progress} ###`)
    }

    private static reportCompletion(): void {
        console.log(`### PROCESS COMPLETED ###`)
    }

    private static exit(code: number): void {
        process.exit(code);
    }

}
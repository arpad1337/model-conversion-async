import {
    FileFormat,
    FileConverter
} from './lib/file-converter'

interface Arguments {
    _: any;
    format: string
}

export default class Program {
    
    public static main(): void {
        const formats: ReadonlyArray<FileFormat> = ['iges','step','stl','obj']

        const argv = process.argv.slice(2)[0].split(' ');
        if (argv.length < 2) {
            console.error('Missing input or output file path')
            this.exit(1)
        }

        console.log('Launching with args', argv)
        
        const format = argv[argv.indexOf('--format') + 1] || 'step';
        const inputFile = argv[0]
        const outputFile = argv[argv.length - 1]

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
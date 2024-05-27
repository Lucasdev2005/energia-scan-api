import { pdfToText } from "pdf-ts";


export class ArquivoService {

    /**
     * @param buffer é a representação do PDF em um array de int 8 BIT.
     */
    public async textoPDF(buffer: Uint8Array) {
        return await pdfToText(buffer);
    }
      
}
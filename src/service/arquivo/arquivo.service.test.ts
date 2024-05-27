import { pdfToText } from 'pdf-ts';
import { ArquivoService } from './arquivo.service';

jest.mock('pdf-ts', () => ({
  pdfToText: jest.fn(),
}));

describe('ArquivoService', () => {
  let service: ArquivoService;

  beforeEach(() => {
    service = new ArquivoService();
  });

  it('deve retornar o texto do buffer de PDF', async () => {
    const buffer = new Uint8Array([/* alguns dados */]);
    const textoEsperado = 'Texto extraído do PDF';
    
    (pdfToText as jest.Mock).mockResolvedValue(textoEsperado);

    const resultado = await service.textoPDF(buffer);
    expect(resultado).toBe(textoEsperado);
    expect(pdfToText).toHaveBeenCalledWith(buffer);
  });

  it('deve lidar com erros lançados pelo pdfToText', async () => {
    const buffer = new Uint8Array([/* alguns dados */]);
    const mensagemErro = 'Falha ao extrair texto do PDF';
    
    (pdfToText as jest.Mock).mockRejectedValue(new Error(mensagemErro));

    await expect(service.textoPDF(buffer)).rejects.toThrow(mensagemErro);
    expect(pdfToText).toHaveBeenCalledWith(buffer);
  });
});

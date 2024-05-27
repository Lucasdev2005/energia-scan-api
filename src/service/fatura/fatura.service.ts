import { FaturaRepository } from "../../repository/fatura/fatura.repository";
import { CreateFaturaDTO } from "../../repository/fatura/types/createFaturaDTO";
import { Paginate } from "../../utils/paginate";
import { ArquivoService } from "../arquivo/arquivo.service";

export class FaturaService {

    constructor(
        private arquivoService: ArquivoService,
        private faturaRepository: FaturaRepository
    ) {}

    public async extrairFatura(pdf: Uint8Array) {
        try {
            const textoFatura = await this.arquivoService.textoPDF(pdf);
            const numeroCliente = this.getNumeroClienteFromTextoFatura(textoFatura);
            const mesReferente = this.getMesReferenciaFromTextoFatura(textoFatura);
            const energiaEletrica = this.getQuantidadeValorFromTextoFatura(textoFatura, "Energia Elétrica");
            const energiaSCEEE = this.getQuantidadeValorFromTextoFatura(textoFatura, "Energia SCEE ISENTA");
            const energiaCompensada = this.getQuantidadeValorFromTextoFatura(textoFatura, "Energia compensada GD I");
            const contribuicaoIlumPublica = this.getContribuicaoIluminacaoPublica(textoFatura);
            const dataReferente = this.getdataReferente(textoFatura);

            return await this.faturaRepository.createFatura(new CreateFaturaDTO({
                contribuicaoIlumPublica,
                energiaCompensada,
                energiaSCEEE,
                energiaEletrica,
                mesReferente,
                numeroCliente,
                dataReferente,
            }));
        } catch (e: any) {
            throw new Error(e);
        }
    }

    public async listarFaturas(paginate: Paginate, where: {FTR_NumeroCliente?: string}) {
        return await this.faturaRepository.listarFaturas(paginate, where);
    }

    public async chart(where: {FTR_NumeroCliente?: string}) {
        return await this.faturaRepository.chart(where);
    }

    /**
     * 
     * @param faturaText é o conteudo da fatura em string. 
     */
    public getNumeroClienteFromTextoFatura(faturaText: string) {
        const regexNumeroCliente = /Nº DA INSTALAÇÃO\s+(\d+)/;
        const resultado = regexNumeroCliente.exec(faturaText);

        if (resultado) {
            return resultado[1];
        } else {
            throw new Error("número do cliente não encontrado na fatura");
        }
    }

    /**
     * 
     * @param faturaText é o conteúdo da fatura em string. 
     */
    public getMesReferenciaFromTextoFatura(faturaText: string) {
        const regexNumeroCliente = /Valor a pagar \(R\$\)\s+(.+)/;
        const resultado = regexNumeroCliente.exec(faturaText);

        if (resultado) {
            return resultado[1].split(" ")[0];
        } else {
            throw new Error("mês da refêrencia não encontrado na fatura");
        }
    }

    /**
     * Extrai dados de uma seção específica da fatura e retorna a energia e valor usado.
     *
     * @param textoFatura O conteúdo da fatura como uma string.
     * @param secao O nome da seção a ser buscada (por exemplo, "Energia Elétrica" ou "Energia SCEE ISENTA").
     * @returns Um objeto contendo a quantidade e o valor da seção especificada.
     * @throws Se a seção especificada não for encontrada na fatura.
     */
    public getQuantidadeValorFromTextoFatura(textoFatura: string, secao: string) {
        const resultado = this.extractItemFromValoresFaturados(textoFatura, secao);

        if (resultado) {
            const arrayItens = resultado[1].split('\n').map(item => item.trim());
            
            return {
                quantidade: parseInt(arrayItens[1]),
                valor: parseFloat(arrayItens[3].replace(',', '.'))
            };
        } else {
            return {
                quantidade: 0,
                valor: 0
            }
        }
    }

    /**
    * @param textoFatura O conteúdo da fatura como uma string.
    */
    private getContribuicaoIluminacaoPublica(textoFatura: string) {
        const resultado = this.extractItemFromValoresFaturados(textoFatura, "Contrib Ilum Publica Municipal");

        if (resultado) {
            return parseFloat(resultado[1].replace(',', '.'));
        } else {
            throw new Error("Contribuição de iluminação pública não informada no documento");
        }
    }

    private getdataReferente(textoFatura: string) {
        const regex = /([A-Z]{3}\/\d{4})/;
        const resultado = textoFatura.match(regex);
    
        if (resultado) {
            const mesAnoStr = resultado[1];
            return this.stringParaData(mesAnoStr);
        } else {
            throw new Error("data referente não informada no documento");
        }
    }
    
    private stringParaData(mesAnoStr: string): Date {
        const meses: { [key: string]: number } = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
            JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
        };
        
        const [mesStr, anoStr] = mesAnoStr.split('/');
        const mes = meses[mesStr as keyof typeof meses];
        const ano = parseInt(anoStr, 10);
    
        if (mes === undefined) {
            throw new Error("Mês inválido na string: " + mesStr);
        }
    
        // Retorna um objeto Date no primeiro dia do mês e ano especificados
        return new Date(ano, mes, 1);
    }
    
    /** 
     * @param textoFatura O conteúdo da fatura como uma string.
     * @param secao O nome da seção a ser buscada (por exemplo, "Energia Elétrica" ou "Energia SCEE ISENTA").
    */
    private extractItemFromValoresFaturados(textoFatura: string, secao: string) {
        const regexPattern = new RegExp(`${secao}\\s*\\n*(.*?)\\s*\\n*TOTAL`, 's');
        return regexPattern.exec(textoFatura);
    }

}
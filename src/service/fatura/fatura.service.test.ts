import 'reflect-metadata';
import { ArquivoService } from '../arquivo/arquivo.service';
import { CreateFaturaDTO } from '../../repository/fatura/types/createFaturaDTO';
import { FaturaService } from './fatura.service';
import { FaturaRepository } from '../../repository/fatura/fatura.repository';

jest.mock('../arquivo/arquivo.service');
jest.mock('../../repository/fatura/fatura.repository');

describe('FaturaService', () => {
    let faturaService: FaturaService;
    let arquivoService: jest.Mocked<ArquivoService>;
    let faturaRepository: jest.Mocked<FaturaRepository>;

    beforeEach(() => {
        arquivoService = new ArquivoService() as jest.Mocked<ArquivoService>;
        faturaRepository = new FaturaRepository({} as any) as jest.Mocked<FaturaRepository>;
        faturaService = new FaturaService(arquivoService, faturaRepository);
    });

    it('deve extrair a fatura de um PDF e criar uma nova fatura', async () => {
        const buffer = new Uint8Array([/* dados do PDF */]);
        const textoFatura = `
        Valores Faturados
        Itens da Fatura
        Unid.
        Quant.
        Preço Unit
        Valor
         (R$)
         PIS/COFINS
        Base Calc.
        Aliq.
        ICMS
        Tarifa Unit.
        ICMS
        ICMS
        Energia Elétrica
        kWh
             622 
         0,74860466 
              465,66
         0,65313000 
        Energia SCEE ISENTA
        kWh
             767 
         0,65313000 
              500,89
         0,65313000 
        Energia compensada GD I
        kWh
             767 
         0,65313000 
             -500,89
         0,65313000 
        Contrib Ilum Publica Municipal
                 43,10
        TOTAL
                508,76
        Histórico de Consumo
        MÊS/ANO
        Cons. kWh
        Média kWh/Dia
        Dias
        JAN/23
           1.389 
            43,40 
          32
        DEZ/22
           1.251 
            40,35 
          31
        NOV/22
           1.439 
            49,62 
          29
        OUT/22
           1.355 
            42,34 
          32
        SET/22
           1.093 
            36,43 
          30
        AGO/22
             686 
            23,65 
          29
        JUL/22
             843 
            26,34 
          32
        JUN/22
             898 
            29,93 
          30
        MAI/22
           1.143 
            35,71 
          32
        ABR/22
           1.150 
            39,65 
          29
        MAR/22
           1.170 
            39,00 
          30
        FEV/22
             874 
            30,13 
          29
        JAN/22
             897 
            27,18 
          33
        Reservado ao Fisco
        SEM VALOR FISCAL
        Base de cálculo (R$)
        Alíquota (%)
        Valor (R$)
        Fale com CEMIG: 116 - CEMIG Torpedo 29810 - Ouvidoria CEMIG: 
        0800 728 3838 - 
        Agência Nacional de Energia Elétrica - ANEEL - Telefone: 167 - 
        Ligação gratuita de telefones fixos e móveis.
        Código de Débito Automático
        Instalação
        Vencimento
        Total a pagar
        008046010818
        3000055479
        11/02/2023
        R$508,76
        Janeiro/2023
        ATENÇÃO:
        DÉBITO AUTOMÁTICO
        Comprovante de Pagamento
        PLIM TELECOMUNICACOES LTDA ME
        RUA JANUARIA 297 CS
        CENTRO
        39400-077 MONTES CLAROS, MG
        CNPJ 09.140.7**/****-**
        INSCRIÇÃO ESTADUAL 00104********
                Nº DO CLIENTE                      Nº DA INSTALAÇÃO
          7005400387        3000055479
                 Referente a                                Vencimento 
                              Valor a pagar (R$)
            JAN/2023               11/02/2023               508,76 
        NOTA FISCAL Nº 096069516 - SÉRIE U
        PTA Nº: 45.000014006.81
        Data de emissão: 23/01/2023
        Classe
        Subclasse
        Modalidade Tarifária
        Datas de Leitura
        Comercial
        Comercial
         Convencional B3
        Anterior
        Atual
        Nº de dias
        Próxima
        Bifásico
        02/12
        03/01
         32
        01/02
        Informações Técnicas
        Tipo de Medição
        Medição
        Leitura
        Leitura
        Constante
        Consumo kWh
        Anterior
        Atual
        de Multiplicação
        Energia kWh
        APC131043954
        74.775
        76.164
        1
        1.389    
         
        SEGUNDA VIA
        CEMIG DISTRIBUIÇÃO S.A. CNPJ 06.981.180/0001-16 / INSC. 
        ESTADUAL 062.322136.0087.
        AV. BARBACENA, 1200 - 17° ANDAR - ALA 1 - BAIRRO SANTO 
        AGOSTINHO
        CEP: 30190-131 - BELO HORIZONTE - MG.
        TARIFA SOCIAL DE ENERGIA ELÉTRICA - TSEE FOI CRIADA PELA LEI Nº
         10.438, DE 26 DE ABRIL DE 2002
        Informações Gerais
        RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, em 
        atendimento à Lei nº 12.007, de 29/07/09,
        declara quitados os débitos do cliente em referência (contrato 
        5013498471), relativos ao fornecimento de
        energia elétrica a esta unidade consumidora, referente aos 
        vencimentos de 01/01/2015 a 31/12/2022,
        excetuando eventuais débitos que sejam posteriormente apurados 
        diante de possível verificação de
        irregularidades ou de revisão de faturamento, que abranjam o 
        período em questão. SALDO ATUAL DE
        GERAÇÃO: 0,00 kWh. Tarifa vigente conforme Res Aneel nº 3.046, 
        de 21/06/2022. Redução aliquota ICMS
        conforme Lei Complementar 194/22. Base de cálculo reduzida nas 
        componentes Distribuição, Transmissão e
        Encargos conf. art. 2º da Lei n.º 194/22 DEZ/22 Band. Verde - 
        JAN/23 Band. Verde.
        `;
        const date = new Date();
        arquivoService.textoPDF.mockResolvedValue(textoFatura);
        faturaRepository.createFatura.mockResolvedValue({ 
            FTR_Id: 1,
            FTR_Consumo_Energia: 366,
            FTR_Data_Referente: date,
            FTR_Economia_GD: 356,
            FTR_NumeroCliente: "1234567899",
            FTR_Valor_Total: 45
        });

        const resultado = await faturaService.extrairFatura(buffer);

        expect(resultado).toEqual({
            FTR_Consumo_Energia: 366,
            FTR_Data_Referente: date,
            FTR_Economia_GD: 356,
            FTR_Id: 1,
            FTR_NumeroCliente: "1234567899",
            FTR_Valor_Total: 45,
        });
        expect(arquivoService.textoPDF).toHaveBeenCalledWith(buffer);
        expect(faturaRepository.createFatura).toHaveBeenCalledWith(expect.any(CreateFaturaDTO));
    });

    it('deve lançar um erro se o número do cliente não for encontrado', async () => {
        const buffer = new Uint8Array([/* dados do PDF */]);
        const textoFatura = `Valor a pagar (R$) JAN/2024`;

        arquivoService.textoPDF.mockResolvedValue(textoFatura);

        await expect(faturaService.extrairFatura(buffer)).rejects.toThrow('número do cliente não encontrado na fatura');
    });

    it('deve lançar um erro se o mês de referência não for encontrado', async () => {
        const buffer = new Uint8Array([/* dados do PDF */]);
        const textoFatura = `Nº DA INSTALAÇÃO 1234567890`;

        arquivoService.textoPDF.mockResolvedValue(textoFatura);

        await expect(faturaService.extrairFatura(buffer)).rejects.toThrow('mês da refêrencia não encontrado na fatura');
    });

    it('deve lançar um erro se a contribuição de iluminação pública não for encontrada', async () => {
        const buffer = new Uint8Array([/* dados do PDF */]);
        const textoFatura = `
            Nº DA INSTALAÇÃO 1234567890
            Valor a pagar (R$) JAN/2024
            `;

        arquivoService.textoPDF.mockResolvedValue(textoFatura);

        await expect(faturaService.extrairFatura(buffer)).rejects.toThrow('Contribuição de iluminação pública não informada no documento');
    });
});

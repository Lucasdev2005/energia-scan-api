import { IsString, Length, IsNumber, ValidateNested, IsDate } from "class-validator";
import { Type } from 'class-transformer';

class EnergiaDTO {
    @IsNumber()
    quantidade!: number;

    @IsNumber()
    valor!: number;

    constructor(quantidade: number, valor: number) {
        this.quantidade = quantidade;
        this.valor = valor;
    }
}

export class CreateFaturaDTO {

    @Length(10, 10)
    @IsString()
    numeroCliente!: string;

    @IsString()
    mesReferente!: string;

    @ValidateNested()
    @Type(() => EnergiaDTO)
    energiaEletrica!: EnergiaDTO;

    @ValidateNested()
    @Type(() => EnergiaDTO)
    energiaSCEEE!: EnergiaDTO;

    @ValidateNested()
    @Type(() => EnergiaDTO)
    energiaCompensada!: EnergiaDTO;

    @IsNumber()
    contribuicaoIlumPublica!: number;

    @IsDate()
    dataReferente!: Date;

    constructor({
        contribuicaoIlumPublica,
        energiaCompensada,
        energiaEletrica,
        energiaSCEEE,
        mesReferente,
        numeroCliente,
        dataReferente
    }: {
        numeroCliente: string,
        mesReferente: string,
        energiaEletrica: EnergiaDTO,
        energiaSCEEE: EnergiaDTO,
        energiaCompensada: EnergiaDTO,
        contribuicaoIlumPublica: number,
        dataReferente: Date
    }) {
        this.numeroCliente = numeroCliente;
        this.mesReferente = mesReferente;
        this.energiaEletrica = energiaEletrica;
        this.energiaSCEEE = energiaSCEEE;
        this.energiaCompensada = energiaCompensada;
        this.contribuicaoIlumPublica = contribuicaoIlumPublica;
        this.dataReferente = dataReferente
    }
}

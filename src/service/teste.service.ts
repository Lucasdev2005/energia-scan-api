export class TestService {
    public async testeInjectable() {
        return new Promise<string>((resolve, reject) => {
            resolve("testeAtualizadoeeee");
        });
    }
}
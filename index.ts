import { Main } from "./src/main";

/** Controllers */
import { FaturaController } from "./src/controller/fatura/fatura.controller";

/** Routes */
import { faturaRoutes } from "./src/controller/fatura/routes";

/** Services */
import { ArquivoService } from "./src/service/arquivo/arquivo.service";

/** Repositorires */
import { FaturaRepository } from "./src/repository/fatura/fatura.repository";

/** Utils */
import { Prisma } from "./src/utils/prisma";
import { FaturaService } from "./src/service/fatura/fatura.service";

const main = new Main({
    controllers: [
        {
            class: FaturaController,
            dependencies: [ {
                class: FaturaService,
                dependencies: [
                    { class: ArquivoService },
                    { 
                        class: FaturaRepository,
                        dependencies: [{ class: Prisma }]
                    }
                ] 
            }],
            routes: faturaRoutes
        }
    ]
});

main.bootstrap();
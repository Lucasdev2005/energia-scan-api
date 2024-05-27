import { Main } from "./src/main";

/** Controllers */
import { FaturaController } from "./src/controller/fatura/fatura.controller";
import { TestController } from "./src/controller/test/test.controller";

/** Routes */
import { faturaRoutes } from "./src/controller/fatura/routes";
import { testRoutes } from "./src/controller/test/routes";

/** Services */
import { TestService } from "./src/service/teste.service";
import { ArquivoService } from "./src/service/arquivo/arquivo.service";

/** Repositorires */
import { FaturaRepository } from "./src/repository/fatura.repository";

/** Utils */
import { Prisma } from "./src/utils/prisma";
import { FaturaService } from "./src/service/fatura/fatura.service";

const main = new Main({
    controllers: [
        {
            class: TestController,
            routes: testRoutes,
            dependencies: [{ class: TestService }]
        },
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
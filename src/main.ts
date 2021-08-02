import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CustomLogger } from "./logger";
import { ApiExceptionFilter } from "./utils/api-exception.filter";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ApiExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("DeltaCraft Teams API")
    .setDescription("Supr čupr API pro Delta craft Teams")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  await app.listen(process.env.PORT || 3001);
};

bootstrap();

import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Template')
    .setDescription('Template API')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'click')
    .addSecurityRequirements('click')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelExpandDepth: -1,
      displayRequestDuration: true,
    },
  });
};

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: '장비 모니터링 API',
      version: '1.0.0',
      description: '장비 상태/이상 감지 시스템 API 문서',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // 본인 서버 주소
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/modules/**/*.js'], // swagger 주석이 작성되어야 하는 경로
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerUi,
  specs,
};
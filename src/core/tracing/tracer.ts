import * as opentelemetry from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const sdk = new opentelemetry.NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-nestjs-core': { enabled: true },
    }),
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'logmar-template-backend',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.JAEGER_COLLECTOR_OTLP_ENDPOINT,
  }),
});

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => {
      console.log('Tracing and Metrics terminated');
    })
    .catch((error) => {
      console.log('Error terminating tracing and metrics', error);
    })
    .finally(() => process.exit(0));
});

export default sdk;

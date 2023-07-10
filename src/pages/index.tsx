import yayJpg from '../assets/yay.jpg';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ConsoleSpanExporter, SimpleSpanProcessor, TracerConfig, WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const collectorExporter = new OTLPTraceExporter({
  // url: "http://10.10.70.112:4318/v1/traces", << cors problem
  // use default http://localhost:4318/v1/traces
  headers: {}
});

const providerConfig: TracerConfig = {
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'umi-app', // or call APP_NAME by calling process.env.APP_NAME 
  }),
};

const provider = new WebTracerProvider(providerConfig);

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new BatchSpanProcessor(collectorExporter));

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-fetch': {
	
      },
    }),
  ],
});

export default function HomePage() {
  return (
      <div>
        <h2>Yay! Welcome to umi!</h2>
        <p>
          <img src={yayJpg} width="388" />
        </p>
        <p>
          To get started, edit <code>pages/index.tsx</code> and save to reload.
        </p>
      </div>
  );
}

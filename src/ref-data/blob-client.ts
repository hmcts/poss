import { ReferenceDataBlobSchema, type ReferenceDataBlob } from './schema.ts';

// ── Private helpers ──────────────────────────────────────────────────────────

function resolveEnv(): { connStr: string; container: string } {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
  }
  const container = process.env.AZURE_STORAGE_CONTAINER ?? 'reference-data';
  return { connStr, container };
}

async function getBlobClient(connStr: string, container: string) {
  const { BlobServiceClient } = await import('@azure/storage-blob');
  return BlobServiceClient.fromConnectionString(connStr)
    .getContainerClient(container)
    .getBlockBlobClient('reference-data.json');
}

const EMPTY_SEED: ReferenceDataBlob = {
  states: [],
  events: [],
  waTasks: [],
  personas: [],
  stateEventAssocs: [],
  eventTaskAssocs: [],
  personaStateAssocs: [],
  personaEventAssocs: [],
  personaTaskAssocs: [],
  transitions: [],
};

// ── Public API ───────────────────────────────────────────────────────────────

export async function readReferenceData(): Promise<ReferenceDataBlob> {
  const { connStr, container } = resolveEnv();
  const blobClient = await getBlobClient(connStr, container);

  let text: string;
  try {
    const response = await blobClient.download();
    const stream = response.readableStreamBody;
    const chunks: Buffer[] = [];
    for await (const chunk of stream as AsyncIterable<Buffer>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    text = Buffer.concat(chunks).toString('utf-8');
  } catch (error: unknown) {
    const err = error as { statusCode?: number; code?: string };
    if (
      err.statusCode === 404 ||
      err.code === 'BlobNotFound' ||
      err.code === 'ContainerNotFound'
    ) {
      return EMPTY_SEED;
    }
    throw error;
  }

  return ReferenceDataBlobSchema.parse(JSON.parse(text));
}

export async function writeReferenceData(data: ReferenceDataBlob): Promise<void> {
  const { connStr, container } = resolveEnv();
  const blobClient = await getBlobClient(connStr, container);

  const content = JSON.stringify(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await blobClient.upload(content, content.length, {
    blobHTTPHeaders: { blobContentType: 'application/json' },
    overwrite: true,
  } as any);
}

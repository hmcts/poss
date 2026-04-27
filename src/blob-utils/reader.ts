/**
 * Generic JSON blob reader.
 * Reads any named blob from the configured Azure container and parses it as JSON.
 * Returns null when the blob does not exist (404 / BlobNotFound / ContainerNotFound).
 * Throws for all other errors.
 */

function resolveEnv(): { connStr: string; container: string } {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
  const container = process.env.AZURE_STORAGE_CONTAINER ?? 'reference-data';
  return { connStr, container };
}

export async function readJsonBlob<T = unknown>(blobName: string): Promise<T | null> {
  const { connStr, container } = resolveEnv();
  const { BlobServiceClient } = await import('@azure/storage-blob');
  const blobClient = BlobServiceClient.fromConnectionString(connStr)
    .getContainerClient(container)
    .getBlockBlobClient(blobName);

  let text: string;
  try {
    const response = await blobClient.download();
    const chunks: Buffer[] = [];
    for await (const chunk of response.readableStreamBody as AsyncIterable<Buffer>) {
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
      return null;
    }
    throw error;
  }

  return JSON.parse(text) as T;
}

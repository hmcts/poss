import { NextResponse } from 'next/server.js';
import { ProductCatalogBlobSchema } from '../../../src/product-catalog/schema.js';

export async function GET(_request: Request): Promise<NextResponse> {
  try {
    const { readProductCatalog } = await import('../../../src/product-catalog/blob-client.js');
    const data = await readProductCatalog();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 400 },
    );
  }

  const result = ProductCatalogBlobSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues.map((e) => e.message).join('; ') },
      { status: 400 },
    );
  }

  try {
    const { writeProductCatalog } = await import('../../../src/product-catalog/blob-client.js');
    await writeProductCatalog(result.data);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

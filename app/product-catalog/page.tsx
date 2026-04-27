'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductCatalogBlob } from '../../src/product-catalog/schema.js';
import {
  addNewProduct,
  applyProductEdit,
  deleteProduct,
} from '../../src/product-catalog/editor-logic.js';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

type EditDraft = Omit<Product, 'id'>;

function personasToString(p: string[] | undefined) { return (p ?? []).join(', '); }
function personasFromString(s: string): string[] { return s.split(',').map(x => x.trim()).filter(Boolean); }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="block text-[11px] text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function ProductCatalogPage() {
  const [baseline, setBaseline] = useState<ProductCatalogBlob | null>(null);
  const [current, setCurrent] = useState<ProductCatalogBlob | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyDraft: EditDraft = { name: '', description: '', category: '', sku: '', status: 'active', eventTrigger: '', releaseScope: '', moscow: '', personas: [], hlFunction: '', userStory: '', expectedOutcomes: '', notes: '' };
  const [editDraft, setEditDraft] = useState<EditDraft>(emptyDraft);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/product-catalog');
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        const data: ProductCatalogBlob = await res.json();
        if (!cancelled) {
          setBaseline(data);
          setCurrent(data);
          setFetchError(null);
        }
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const handleSave = useCallback(async () => {
    if (!current) return;
    setSaving(true);
    try {
      const res = await fetch('/api/product-catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current),
      });
      if (res.status === 204) {
        setBaseline(current);
        setToast({ message: 'Saved successfully', type: 'success' });
      } else {
        const body = await res.json().catch(() => ({}));
        setToast({ message: (body as { error?: string }).error ?? `HTTP ${res.status}`, type: 'error' });
      }
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : String(err), type: 'error' });
    } finally {
      setSaving(false);
    }
  }, [current]);

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setEditDraft({ name: product.name, description: product.description, category: product.category, sku: product.sku, status: product.status, eventTrigger: product.eventTrigger ?? '', releaseScope: product.releaseScope ?? '', moscow: product.moscow ?? '', personas: product.personas ?? [], hlFunction: product.hlFunction ?? '', userStory: product.userStory ?? '', expectedOutcomes: product.expectedOutcomes ?? '', notes: product.notes ?? '' });
    setConfirmDeleteId(null);
  }

  function handleSaveRow(id: string) {
    setCurrent((c) => c ? { ...c, products: applyProductEdit(c.products, id, editDraft) } : c);
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
  }

  function handleAdd() {
    setCurrent((c) => {
      if (!c) return c;
      const updated = addNewProduct(c.products);
      const newProduct = updated[updated.length - 1];
      setEditingId(newProduct.id);
      setEditDraft(emptyDraft);
      return { ...c, products: updated };
    });
  }

  function handleDeleteConfirm(id: string) {
    setCurrent((c) => c ? { ...c, products: deleteProduct(c.products, id) } : c);
    setConfirmDeleteId(null);
  }

  const unsaved = baseline !== null && current !== null && JSON.stringify(baseline) !== JSON.stringify(current);

  if (loading) {
    return <div className="animate-pulse p-6 text-slate-400">Loading product catalog...</div>;
  }

  if (fetchError) {
    return (
      <div className="p-6 text-red-400">
        <p className="font-semibold">Failed to load product catalog</p>
        <p className="text-sm mt-1">{fetchError}</p>
      </div>
    );
  }

  if (!current) return null;

  const inputCls = 'w-full bg-slate-800 text-slate-100 border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500';

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Product Catalogue</h1>
        <div className="flex items-center gap-2">
          {unsaved && <span className="inline-block w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />}
          <button
            onClick={handleSave}
            disabled={!unsaved || saving}
            className={[
              'px-4 py-2 rounded text-sm font-medium transition-colors',
              unsaved && !saving
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={['px-4 py-3 rounded text-sm font-medium', toast.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'].join(' ')}>
          {toast.message}
        </div>
      )}

      {/* Add button */}
      <div>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 rounded text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          + Add product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/60 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {current.products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                  No products yet. Click &quot;Add product&quot; to get started.
                </td>
              </tr>
            )}
            {current.products.map((product) => {
              const isEditing = editingId === product.id;
              const isConfirming = confirmDeleteId === product.id;

              if (isEditing) {
                return (
                  <tr key={product.id}>
                    <td colSpan={6} className="p-4 bg-slate-800/60 border-b border-slate-700">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Field label="SKU"><input className={inputCls} value={editDraft.sku} onChange={(e) => setEditDraft((d) => ({ ...d, sku: e.target.value }))} placeholder="SKU" /></Field>
                        <Field label="Name"><input className={inputCls} value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Name" /></Field>
                        <Field label="Category"><input className={inputCls} value={editDraft.category} onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))} placeholder="Category" /></Field>
                        <Field label="Status">
                          <select className={inputCls} value={editDraft.status} onChange={(e) => setEditDraft((d) => ({ ...d, status: e.target.value as 'active' | 'inactive' }))}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </Field>
                        <Field label="Description" wide><input className={inputCls} value={editDraft.description} onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))} placeholder="Description" /></Field>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Journey coverage</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Event trigger"><input className={inputCls} value={editDraft.eventTrigger ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, eventTrigger: e.target.value }))} placeholder="Exact event name" /></Field>
                        <Field label="Release scope"><input className={inputCls} value={editDraft.releaseScope ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, releaseScope: e.target.value }))} placeholder="e.g. r1, tbc" /></Field>
                        <Field label="MoSCoW"><input className={inputCls} value={editDraft.moscow ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, moscow: e.target.value }))} placeholder="Must / Should / Could / Won't" /></Field>
                        <Field label="Personas (comma-separated)"><input className={inputCls} value={personasToString(editDraft.personas)} onChange={(e) => setEditDraft((d) => ({ ...d, personas: personasFromString(e.target.value) }))} placeholder="e.g. Caseworker, Manager" /></Field>
                        <Field label="HL Function" wide><input className={inputCls} value={editDraft.hlFunction ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, hlFunction: e.target.value }))} placeholder="High-level function" /></Field>
                        <Field label="User story" wide><input className={inputCls} value={editDraft.userStory ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, userStory: e.target.value }))} placeholder="As a... I want... so that..." /></Field>
                        <Field label="Expected outcomes" wide><input className={inputCls} value={editDraft.expectedOutcomes ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, expectedOutcomes: e.target.value }))} placeholder="What success looks like" /></Field>
                        <Field label="Notes" wide><input className={inputCls} value={editDraft.notes ?? ''} onChange={(e) => setEditDraft((d) => ({ ...d, notes: e.target.value }))} placeholder="Additional notes" /></Field>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => handleSaveRow(product.id)} className="px-3 py-1.5 rounded text-sm font-medium bg-green-700 hover:bg-green-600 text-white">Save</button>
                        <button onClick={handleCancel} className="px-3 py-1.5 rounded text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200">Cancel</button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{product.sku || <span className="italic text-slate-600">—</span>}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{product.name || <span className="italic text-slate-500">Untitled</span>}</td>
                  <td className="px-4 py-3 text-slate-400">{product.category || <span className="italic text-slate-600">—</span>}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{product.description || <span className="italic text-slate-600">—</span>}</td>
                  <td className="px-4 py-3">
                    <span className={['inline-block px-2 py-0.5 rounded-full text-xs font-medium', product.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-slate-700 text-slate-400'].join(' ')}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => handleEdit(product)} className="text-sm text-indigo-400 hover:text-indigo-300 mr-3">Edit</button>
                    {isConfirming ? (
                      <>
                        <span className="text-xs text-slate-400 mr-1">Delete?</span>
                        <button onClick={() => handleDeleteConfirm(product.id)} className="text-sm text-red-400 hover:text-red-300 mr-2">Confirm</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-sm text-slate-400 hover:text-slate-200">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(product.id)} className="text-sm text-slate-500 hover:text-red-400 transition-colors">Delete</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

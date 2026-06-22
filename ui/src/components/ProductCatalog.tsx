import React, { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    created_at: string;
    updated_at: string;
}

export default function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [sortBy, setSortBy] = useState<"created_at" | "updated_at">("created_at")
    const [limit, setLimit] = useState<number>(20)

    useEffect(() => {
        const queryParams = new URLSearchParams({
            skip: String(page * limit),
            limit: String(limit),
            sort_by: sortBy
        });
        if (category) {
            queryParams.append('category', category);
        }
        fetch(`http://127.0.0.1:8000/api/items?${queryParams.toString()}`)
            .then((res) => res.json())
            .then((data: Product[]) => setProducts(data))
            .catch((err) => console.error("Error fetching products:", err));
    }, [category, page, sortBy, limit]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-slate-50 text-slate-800 antialiased min-h-screen">

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">Product Catalog</h1>
                    <p className="text-sm text-slate-500 mt-1">Viewing all available items</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="category" className="text-sm font-medium text-slate-600 whitespace-nowrap">Filter by:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                        className="w-full sm:w-48 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Kitchen Appliances">Kitchen Appliances</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Food">Food</option>
                        <option value="Pets">Pets</option>
                        <option value="Fashion">Fashion</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="sort_by" className="text-sm font-medium text-slate-600 whitespace-nowrap">Sort by:</label>
                    <select
                        id="sort_by"
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value as "created_at" | "updated_at"); setPage(0); }}
                        className="w-full sm:w-48 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="created_at">Created At</option>
                        <option value="updated_at">Updated At</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="limit" className="text-sm font-medium text-slate-600 whitespace-nowrap">Products per page:</label>
                    <input
                        id="limit"
                        type='number'
                        value={limit}
                        onChange={(e) => { if (Number(e.target.value) > 0 && Number(e.target.value) <= 40) setLimit(Number(e.target.value)); setPage(0) }}
                        className="w-full sm:w-48 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                    </input>
                </div>

            </header>

            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md tracking-wide uppercase">
                                    {product.category}
                                </span>
                                <span className="text-lg font-bold text-slate-900">
                                    ${(product.price / 100).toFixed(2)}
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-1 tracking-tight">{product.name}</h2>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 space-y-0.5">
                            <p>Added: <span className="font-medium text-slate-500">{product.created_at?.slice(0, 10)}</span></p>
                            <p>Updated: <span className="font-medium text-slate-500">{product.updated_at?.slice(0, 10)}</span></p>
                        </div>
                    </div>
                ))}
            </main>

            <footer className="flex items-center justify-between border-t border-slate-200 pt-6">
                <div className="text-sm text-slate-500">
                    Showing items <span className="font-medium text-slate-800">{page * limit + 1}</span> to <span className="font-medium text-slate-800">{page * limit + products.length}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label htmlFor="page" className="text-sm font-medium text-slate-600 whitespace-nowrap">Page:</label>
                        <input
                            id="page"
                            type='number'
                            value={page}
                            onChange={(e) => { if (Number(e.target.value) >= 0 && Number(e.target.value) * limit < 200000) setPage(Number(e.target.value)) }}
                            className="w-full sm:w-48 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        >
                        </input>
                    </div>

                    <button
                        disabled={products.length < limit}
                        onClick={() => setPage((p) => p + 1)}
                        className="bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </footer>

        </div>
    );
}

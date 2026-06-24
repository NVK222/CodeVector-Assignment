import { useState, useEffect } from 'react';

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
    const [sortBy, setSortBy] = useState<"created_at" | "updated_at">("created_at")
    const [limit, setLimit] = useState<number>(20)
    const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isServerWakingUp, setIsServerWakingUp] = useState<boolean>(false)
    const [serverCheckCompleted, setServerCheckCompleted] = useState<boolean>(false)

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
    useEffect(() => {
        const controller = new AbortController();

        const wakeUpTimeout = setTimeout(() => {
            if (!serverCheckCompleted) {
                setIsServerWakingUp(true);
            }
        }, 5000);

        fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal })
            .then((res) => {
                if (res.ok) {
                    clearTimeout(wakeUpTimeout);
                    setIsServerWakingUp(false);
                    setServerCheckCompleted(true);
                }
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Health check failed:", err);
                }
            });

        return () => {
            clearTimeout(wakeUpTimeout);
            controller.abort();
        };
    }, []);
    useEffect(() => {
        setIsLoading(true)
        const controller = new AbortController()
        const { signal } = controller
        const currentCursor = cursorHistory[currentPageIndex]
        const queryParams = new URLSearchParams({
            limit: String(limit),
            sort_by: sortBy
        });
        if (category) {
            queryParams.append('category', category);
        }
        if (currentCursor) {
            queryParams.append("cursor", currentCursor)
        }
        fetch(`${API_BASE_URL}/api/items?${queryParams.toString()}`, { signal })
            .then((res) => res.json())
            .then((data: Product[]) => { setProducts(data); setIsLoading(false) })
            .catch((err) => { if (err.name !== "AbortError") { console.error("Error fetching products:", err); setIsLoading(false) } });

        return () => controller.abort()
    }, [category, currentPageIndex, sortBy, limit]);


    const handleNextPage = () => {
        if (products.length === 0 || isLoading) return;

        const lastItem = products[products.length - 1]
        const nextCursor = sortBy === "created_at" ? lastItem.created_at : lastItem.updated_at

        if (currentPageIndex + 1 >= cursorHistory.length) {
            setCursorHistory((prevCurrHistory) => [...prevCurrHistory, nextCursor])
        }
        setCurrentPageIndex(currentPageIndex + 1)
    }

    const handlePrevPage = () => {
        if (isLoading) return;
        setCurrentPageIndex(Math.max(0, currentPageIndex - 1))
    }

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory)
        setCursorHistory([null])
        setCurrentPageIndex(0)
    }

    const handleSortByChange = (newSortBy: "created_at" | "updated_at") => {
        setSortBy(newSortBy)
        setCursorHistory([null])
        setCurrentPageIndex(0)
    }


    const handleLimitChange = (newLimit: string) => {
        if (Number(newLimit) <= 0 || Number(newLimit) > 40) return
        setLimit(Number(newLimit))
        setCursorHistory([null])
        setCurrentPageIndex(0)
    }



    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-slate-50 text-slate-800 antialiased min-h-screen">
            {isServerWakingUp && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-3 shadow-xs animate-pulse">
                    <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-sm">Server is waking up!</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            The backend is hosted on a free Render service. It takes about 50–60 seconds to spin up on the first request. Thank you for your patience!
                        </p>
                    </div>
                </div>
            )}

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">Product Catalog</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isLoading ? 'Loading catalog items...' : 'Viewing all available items'}
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="category" className="text-sm font-medium text-slate-600 whitespace-nowrap">Filter by:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => { handleCategoryChange(e.target.value) }}
                        disabled={isLoading}
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
                        disabled={isLoading}
                        onChange={(e) => { handleSortByChange(e.target.value as "created_at" | "updated_at") }}
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
                        disabled={isLoading}
                        value={limit}
                        onChange={(e) => { handleLimitChange(e.target.value) }}
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
                    Showing items <span className="font-medium text-slate-800">{currentPageIndex * limit + 1}</span> to <span className="font-medium text-slate-800">{currentPageIndex * limit + products.length}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={currentPageIndex === 0 || isLoading}
                        onClick={() => handlePrevPage()}
                        className="bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                        Previous
                    </button>
                    <button
                        disabled={products.length < limit || isLoading}
                        onClick={() => handleNextPage()}
                        className="bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </footer>

        </div>
    );
}

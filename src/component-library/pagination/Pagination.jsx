import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useSearchParams } from "react-router";

// let paginationExample = {
//     current_page: 1,
//     has_next: true,
//     has_previous: false,
//     total_pages: 10,
// };

const Pagination = ({ pagination = {}, className = "" }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div className={className}>
            <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-2xs"
            >
                <button
                    onClick={() => {
                        searchParams.set("page", pagination.current_page - 1);
                        setSearchParams(searchParams);
                    }}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-l-full"
                    disabled={!pagination.has_previous}
                >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                </button>

                <button
                    aria-current="page"
                    className="relative z-10 inline-flex items-center bg-primary-palette-500 px-4 py-2 text-sm font-semibold text-on-primary "
                >
                    {pagination.current_page}
                </button>

                {Boolean(
                    pagination.current_page + 1 < pagination.total_pages
                ) && (
                    <button
                        onClick={() => {
                            searchParams.set(
                                "page",
                                pagination.current_page + 1
                            );
                            setSearchParams(searchParams);
                        }}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        {pagination.current_page + 1}
                    </button>
                )}

                {Boolean(
                    pagination.current_page + 2 < pagination.total_pages
                ) && (
                    <button
                        onClick={() => {
                            searchParams.set(
                                "page",
                                pagination.current_page + 2
                            );
                            setSearchParams(searchParams);
                        }}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        {pagination.current_page + 2}
                    </button>
                )}

                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                </span>

                <button
                    onClick={() => {
                        searchParams.set("page", pagination.total_pages);
                        setSearchParams(searchParams);
                    }}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    {pagination.total_pages}
                </button>

                <button
                    onClick={() => {
                        searchParams.set("page", pagination.current_page + 1);
                        setSearchParams(searchParams);
                    }}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-r-full"
                    disabled={!pagination.has_next}
                >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;

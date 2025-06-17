import React from "react";
import { Link } from "react-router";
import Button from "../butttons/Button";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const DashboardStats = ({
    stats = [],
    className = "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
}) => {
    return (
        <div>
            <dl className={classNames("grid ", className)}>
                {stats.map((item) => (
                    <div
                        key={item.id}
                        className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-xs sm:px-6 sm:pt-6"
                    >
                        <dt>
                            {Boolean(item.icon) && (
                                <div className="absolute rounded-md bg-primary-palette-500 p-3">
                                    <item.icon
                                        aria-hidden="true"
                                        className="h-6 w-6 text-white"
                                    />
                                </div>
                            )}
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                {item.name}
                            </p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">
                                {item.stat}
                            </p>

                            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                                <div className="text-sm">
                                    {Boolean(item.url) && (
                                        <Link to={item.url}>
                                            <Button variant="text">
                                                View all
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default DashboardStats;

import React from "react";
import { Link } from "react-router";

const BreadCrumbs = ({ paths = [{ name: "home", path: "/" }] }) => {
    return (
        <>
            {paths && paths.length > 0 && (
                <div className="font-medium text-sm md:text-base ">
                    {paths.map((path, index) => (
                        <span key={path.name}>
                            <Link
                                to={path.path}
                                className="mx-1 capitalize hover:text-copper-600"
                            >
                                {path.name}
                            </Link>
                            {Boolean(index < paths.length - 1) && (
                                <span className="sperator">/</span>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
};

export default BreadCrumbs;
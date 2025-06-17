import {
    MagnifyingGlassCircleIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";
import CenteredDialog from "../dialogs/CenteredDialog";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ImageThumbnail = ({
    src,
    alt,
    imageContainerClassNames = "h-24 w-24 rounded-md",
    imageClassNames = "object-cover object-center rounded-md",
    actions = null,
    allowMagnify = true,
}) => {
    return (
        <div
            className={classNames(
                imageContainerClassNames,
                "border flex items-center justify-center shrink-0 relative group"
            )}
        >
            {Boolean(Boolean(src) && Boolean(src != "")) ? (
                <>
                    {allowMagnify && (
                        <CenteredDialog
                            component={
                                <div className="h-full w-full hidden group-hover:flex rounded-md absolute left-0 top-0 z-10 bg-gray-400 opacity-30 items-center justify-center">
                                    <MagnifyingGlassCircleIcon className="h-8 w-8 text-white" />
                                </div>
                            }
                        >
                            <div className="flex flex-col w-full h-full ">
                                <img
                                    src={src}
                                    alt={alt}
                                    className={classNames(
                                        imageClassNames,
                                        "h-full w-auto"
                                    )}
                                />
                                {Boolean(actions) && (
                                    <div className="mt-4 w-full">{actions}</div>
                                )}
                            </div>
                        </CenteredDialog>
                    )}
                    <img
                        src={src}
                        alt={alt}
                        className={classNames(
                            imageClassNames,
                            "h-full w-full p-1"
                        )}
                    />
                </>
            ) : (
                <PhotoIcon className="h-[60%] w-auto text-gray-300 m-auto" />
            )}
        </div>
    );
};

export default ImageThumbnail;

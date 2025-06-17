import React from "react";
import { Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import PageTabs from "../../navigation/PageTabs";
import NotificationBar from "../../alerts/NotificationBar";
import Socials from "../../utils/Socials";
import AuthenticatedUserActionButton from "../../account-management/authentication/AuthenticatedUserActionButton";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ScaffoldContext = React.createContext(null);

export const useScaffoldContext = () => {
    return React.useContext(ScaffoldContext);
};

const ScaffoldWithSideBar = ({
    headerTitle,
    headerActions = <AuthenticatedUserActionButton />,
    tabs,
    mainClassNames = "",
    sidebarComponent,
    children,
}) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [tabList, setTabList] = React.useState(tabs || []);
    const [title, setTitle] = React.useState(headerTitle || "");

    React.useEffect(() => {
        setTabList(tabs);
        setTitle(headerTitle);
    }, [tabs, headerTitle]);

    return (
        <div>
            <NotificationBar />
            <Transition show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex">
                        <TransitionChild
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 bg-white">
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </TransitionChild>
                                {sidebarComponent}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            <div className="flex min-h-screen w-full">
                <div className="hidden lg:flex lg:w-64 flex-col shrink-0">
                    {sidebarComponent}
                </div>
                <div className="flex flex-col flex-1 grow w-full lg:border-l border-outline-variant">
                    <header className="flex flex-col w-full">
                        <div className="flex items-center border-b border-outline-variant py-2 px-4 sm:px-6 md:px-8 min-h-14 lg:min-h-16">
                            <button
                                type="button"
                                className="text-gray-700 pr-3 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <h1 className="text-xl md:text-2xl font-semibold">
                                {title}
                            </h1>
                            <div className="ml-auto flex items-center space-x-4">
                                {Boolean(headerActions) && headerActions}
                            </div>
                        </div>
                        {Boolean(tabList?.length > 0) && (
                            <PageTabs navigation={tabList} />
                        )}
                    </header>
                    <main
                        className={classNames(
                            mainClassNames,
                            "flex flex-col flex-1 grow w-full"
                        )}
                    >
                        <ScaffoldContext.Provider
                            value={{ setTitle, setTabList }}
                        >
                            {children}
                        </ScaffoldContext.Provider>
                    </main>
                    <footer className="border-t border-outline-variant min-h-14 w-full">
                        <div className="mx-auto max-w-7xl px-6 py-4 md:flex md:items-center md:justify-between md:px-8">
                            <Socials />
                            <div className="mt-4 md:order-1 md:mt-0">
                                <p className="text-center text-xs text-gray-500">
                                    &copy; Bizna Tech, 2025. All rights
                                    reserved.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ScaffoldWithSideBar;

import Socials from "../../utils/Socials";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const FooterOne = ({
    footerText,
    socials,
    className = "bg-primary-main text-gray-200",
}) => {
    return (
        <footer className={classNames("flex justify-center", className)}>
            <div className="container w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 px-6 md:px-8">
                <div className="md:order-2">
                    <Socials socials={socials} />
                </div>
                <p className="text-center md:order-1">{footerText}</p>
            </div>
        </footer>
    );
};

export default FooterOne;

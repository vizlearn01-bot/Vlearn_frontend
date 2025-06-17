const Socials = ({ socials = [], className = "size-6" }) => {
    return (
        <>
            {Boolean(socials.length > 0) && (
                <div className="flex justify-center space-x-3 md:order-2">
                    {socials.map((item) => (
                        <a key={item.name} href={item.href} target="_blank">
                            <span className="sr-only">{item.name}</span>
                            {Boolean(item.icon) && (
                                <item.icon
                                    className={className}
                                    aria-hidden="true"
                                />
                            )}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
};

export default Socials;

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const InvoiceDetails = ({ invoice, actions }) => {
    const status = {
        PAID: "text-green-700 bg-green-50 ring-green-600/20",
        DRAFT: "text-gray-700 bg-gray-50 ring-gray-600/20",
        CANCELLED: "text-red-700 bg-red-50 ring-red-600/20",
        PENDING: "text-indigo-700 bg-indigo-50 ring-indigo-600/20",
    };

    return (
        <div className="flex flex-col">
            <div className="px-4 py-8 sm:px-8 shadow-xs ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg">
                <h2 className="text-base font-semibold text-gray-900 flex space-x-2">
                    <span>Invoice: {invoice?.invoice_number}</span>
                    <span
                        className={classNames(
                            status[invoice?.status],
                            "rounded-full whitespace-nowrap px-2 py-0.5 text-sm font-medium ring-1 ring-inset min-w-10 flex "
                        )}
                    >
                        {invoice?.status_display}
                    </span>
                </h2>
                <dl className="mt-6 grid grid-cols-1 text-sm/6 sm:grid-cols-2">
                    <div className="sm:pr-4">
                        <dt className="inline text-gray-500">Issued on</dt>{" "}
                        <dd className="inline text-gray-700">
                            <time dateTime={invoice?.issued_date}>
                                {new Date(
                                    invoice?.issued_date
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </dd>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:pl-4">
                        <dt className="inline text-gray-500">Due on</dt>{" "}
                        <dd className="inline text-gray-700">
                            {Boolean(invoice?.due_date) ? (
                                <time dateTime={invoice?.due_date}>
                                    {new Date(
                                        invoice?.due_date
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                            ) : (
                                "--"
                            )}
                        </dd>
                    </div>
                    <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                        <dt className="font-semibold text-gray-900">From</dt>
                        <dd className="mt-2 text-gray-500">
                            <span className="font-medium text-gray-900">
                                {invoice?.invoice_from?.full_name}
                            </span>
                            <br />
                            {invoice?.invoice_from?.phone_number} <br />
                            {invoice?.invoice_from?.email}
                            <br />
                            {invoice?.invoice_from?.city},{" "}
                            {invoice?.invoice_from?.street_address} <br />
                            {invoice?.invoice_from?.postal_code}
                        </dd>
                    </div>
                    <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pt-6 sm:pl-4">
                        <dt className="font-semibold text-gray-900">To</dt>
                        <dd className="mt-2 text-gray-500">
                            <span className="font-medium text-gray-900">
                                {invoice?.invoice_to?.full_name}
                            </span>
                            <br />
                            {invoice?.invoice_to?.phone_number} <br />
                            {invoice?.invoice_to?.email} <br />
                            {invoice?.invoice_to?.city},{" "}
                            {invoice?.invoice_to?.street_address} <br />
                            {invoice?.invoice_to?.postal_code}
                        </dd>
                    </div>
                </dl>
                <table className="mt-16 w-full text-left text-sm/6 whitespace-nowrap">
                    <colgroup>
                        <col className="w-full" />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead className="border-b border-gray-200 text-gray-900">
                        <tr>
                            <th scope="col" className="px-0 py-3 font-semibold">
                                Items
                            </th>
                            <th
                                scope="col"
                                className="hidden py-3 pr-0 pl-8 text-right font-semibold sm:table-cell"
                            >
                                Unit Price
                            </th>
                            <th
                                scope="col"
                                className="hidden py-3 pr-0 pl-8 text-right font-semibold sm:table-cell"
                            >
                                Quantity
                            </th>
                            <th
                                scope="col"
                                className="py-3 pr-0 pl-8 text-right font-semibold"
                            >
                                Item Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice?.invoice_items?.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-gray-100"
                            >
                                <td className="max-w-0 px-0 py-5 align-top">
                                    <div className="truncate font-medium text-gray-900">
                                        {item.name}
                                    </div>
                                    <div className="truncate text-gray-500">
                                        {item.description}
                                    </div>
                                </td>
                                <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                                    {item.unit_price}
                                </td>
                                <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                                    {item.quantity}
                                </td>
                                <td className="py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums">
                                    {item.item_total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th
                                scope="row"
                                className="pt-4 font-semibold text-gray-900 sm:hidden"
                            >
                                Total
                            </th>
                            <th
                                scope="row"
                                colSpan={3}
                                className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                            >
                                Total
                            </th>
                            <td className="pt-4 pr-0 pb-0 pl-8 text-right font-semibold text-gray-900 tabular-nums">
                                {invoice?.total_amount}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {Boolean(actions) &&(
                <div className="w-full mt-4">
                    {actions}
                </div>
            )} 
        </div>
    );
};

export default InvoiceDetails;

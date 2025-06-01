import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center space-x-2">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-800 font-medium capitalize">{value}</span>
              ) : (
                <Link to={to} className="hover:underline capitalize">
                  {value}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

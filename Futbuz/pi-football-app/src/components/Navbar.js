import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/register'); 
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/'); 
  };

  return (
    <div className="font-semibold flex p-4 justify-between items-center shadow-sm m-3 border-neutral-800 border-2">
      <div className="flex items-center space-x-3 ml-2">
        <img src='/futbuzz-logo.png' className='h-9' alt="logo" />
        {isAuthenticated && (
          <span className="ml-4 text-blue-800 font-bold items-center text-center">Welcome!</span>
        )}
      </div>

      <div className="flex space-x-6 ml-auto mr-3">
        <Link to="/" className='hover:text-blue-600 active:text-blue-600'>Standings</Link>
        <Link to="/matches" className='hover:text-blue-600 active:text-blue-600'>Matches</Link>
        <Link to="/about" className='hover:text-blue-600 active:text-blue-600'>About Us</Link>

        {isAuthenticated ? (
          <button onClick={handleSignOut} className='hover:text-blue-600 active:text-blue-600'>
            Sign Out
          </button>
        ) : (
          <Link to="/signin">
            <button className='hover:text-blue-600 active:text-blue-600'>Sign In</button>
          </Link>
        )}
      </div>
    </div>
  );
}

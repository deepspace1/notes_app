import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ProfileModal from './ProfileModal';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    N
                                </div>
                                <Link to="/" className="text-xl font-bold text-white tracking-tight">
                                    Notes
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-full transition-colors focus:outline-none"
                                        title="View Profile"
                                    >
                                        <span className="text-gray-300 text-sm hidden sm:block font-medium">{user.name}</span>
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-sm font-bold text-white shadow-md border border-white/10 ring-2 ring-transparent hover:ring-white/20 transition-all">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all hover:shadow-lg"
                                    >
                                        Signup
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <ProfileModal
                user={user}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onLogout={handleLogout}
            />
        </>
    );
};

export default Navbar;

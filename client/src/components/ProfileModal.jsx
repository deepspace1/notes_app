import { useRef, useEffect } from 'react';

const ProfileModal = ({ user, isOpen, onClose, onLogout }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div ref={modalRef} className="glass-card w-full max-w-md p-8 relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white/10 mb-6">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                    <p className="text-gray-400 text-sm mb-6">{user?.email}</p>

                    <div className="w-full bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-2 border-r border-white/10">
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                                <p className="text-green-400 font-bold mt-1">Active</p>
                            </div>
                            <div className="text-center p-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Member Since</p>
                                <p className="text-white font-bold mt-1">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;

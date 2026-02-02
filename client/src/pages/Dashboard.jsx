import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'

    useEffect(() => {
        let filtered = [...notes];

        // 1. Filter by Search Query
        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (note) =>
                    note.title.toLowerCase().includes(lowerQuery) ||
                    note.content.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredNotes(filtered);
    }, [searchQuery, notes, sortBy]);

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes');
            setNotes(data);
            setFilteredNotes(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch notes');
            setLoading(false);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.warning('Title and content cannot be empty');
            return;
        }

        try {
            if (editNoteId) {
                // Update
                const { data } = await api.put(`/notes/${editNoteId}`, { title, content });
                setNotes(notes.map((note) => (note._id === editNoteId ? data : note)));
                toast.success('Note updated successfully');
                setEditNoteId(null);
            } else {
                // Create
                const { data } = await api.post('/notes', { title, content });
                setNotes([data, ...notes]);
                toast.success('Note created successfully');
            }
            setTitle('');
            setContent('');
        } catch (err) {
            console.error(err);
            toast.error(editNoteId ? 'Failed to update note' : 'Failed to create note');
        }
    };

    const handleEdit = (note) => {
        setEditNoteId(note._id);
        setTitle(note.title);
        setContent(note.content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id !== id));
            toast.success('Note deleted successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete note');
        }
    };

    const handleCancelEdit = () => {
        setEditNoteId(null);
        setTitle('');
        setContent('');
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar: Note Form */}
                        <div className="lg:w-1/3 space-y-8">
                            {/* Note Form */}
                            <div className="glass-card p-6 text-white sticky top-24">
                                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">
                                    {editNoteId ? 'Edit Note' : 'Create New Note'}
                                </h3>
                                <form onSubmit={handleCreateNote} className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="block w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter note title..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                                            Content
                                        </label>
                                        <textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                            rows={5}
                                            className="block w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Write your thoughts here..."
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            className="flex-1 justify-center py-2.5 px-4 border border-transparent shadow-lg text-sm font-bold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition hover:-translate-y-0.5"
                                        >
                                            {editNoteId ? 'Update Note' : 'Add Note'}
                                        </button>
                                        {editNoteId && (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="flex-1 justify-center py-2.5 px-4 border border-white/20 shadow-sm text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Notes List with Search */}
                        <div className="lg:w-2/3">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-2xl font-bold text-white drop-shadow-md">My Notes</h3>
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all hover:bg-white/20"
                                        >
                                            <option value="newest" className="text-gray-900">Newest First</option>
                                            <option value="oldest" className="text-gray-900">Oldest First</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.586 8.757 9.343 7.343 10.757l2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="relative w-full sm:w-64">
                                        <input
                                            type="text"
                                            placeholder="Search notes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                                </div>
                            ) : filteredNotes.length === 0 ? (
                                <div className="glass-card p-10 text-center text-gray-300">
                                    {searchQuery ? (
                                        <>
                                            <p className="text-xl">No matching notes found.</p>
                                            <p className="text-sm mt-2">Try a different search term.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xl">No notes yet.</p>
                                            <p className="text-sm mt-2">Create your first note to get started!</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredNotes.map((note) => (
                                        <div key={note._id} className="glass-card p-6 flex flex-col justify-between h-full relative group">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="text-lg font-bold text-white line-clamp-1 pr-2" title={note.title}>{note.title}</h4>
                                                    <div className="flex space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(note)}
                                                            className="p-1 text-blue-300 hover:text-white transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(note._id)}
                                                            className="p-1 text-red-400 hover:text-white transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-5">{note.content}</p>
                                            </div>
                                            <p className="mt-4 text-xs text-gray-500 border-t border-white/10 pt-3 flex justify-between">
                                                <span>Created</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

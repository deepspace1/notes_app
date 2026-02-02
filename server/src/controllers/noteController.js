const Note = require('../models/Note');

// @desc    Get notes
// @route   GET /api/v1/notes
// @access  Private
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Set note
// @route   POST /api/v1/notes
// @access  Private
const createNote = async (req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            res.status(400).json({ message: 'Please add title and content' });
            return;
        }

        const note = await Note.create({
            title: req.body.title,
            content: req.body.content,
            user: req.user.id,
        });

        res.status(200).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        // Check for user
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Make sure the logged in user matches the note user
        if (note.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete note
// @route   DELETE /api/v1/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        // Check for user
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Make sure the logged in user matches the note user
        if (note.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        // await note.remove(); // Deprecated in newer Mongoose versions but might work depending on version. 
        // Safer to use deleteOne or findByIdAndDelete
        await Note.deleteOne({ _id: req.params.id });

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};

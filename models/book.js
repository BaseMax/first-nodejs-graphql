const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    }
);


module.exports = mongoose.model('Book', bookSchema);
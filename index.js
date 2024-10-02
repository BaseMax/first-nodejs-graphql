/*
 * @Name: First NodeJs GraphQL
 * @Author: Max Base
 * @Repository: https://github.com/BaseMax/first-nodejs-graphql
 * @Date: 2020-12-24
 */
const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


const app = express();
const PORT = 5000;


mongoose.connect('mongodb://127.0.0.1:27017/library_db')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));


const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: async (author) => {
        return await Book.find({ authorId: author.id });
      }
    }
  })
});


const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: async (book) => {
        return await Author.findById(book.authorId);
      }
    }
  })
});


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parent, args) => await Book.findById(args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: async () => await Book.find(),
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parent, args) => await Author.findById(args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: async () => await Author.find(),
    }
  })
});


const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const book = new Book({ name: args.name, authorId: args.authorId });
        await book.save();
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const author = new Author({ name: args.name });
        await author.save();
        return author;
      }
    }
  })
});


const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
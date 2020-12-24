const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull
} = require('graphql')

const app = express()

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'HelloWorld',
		fields: () => ({
			message: {
				type: GraphQLString,
				resolve: (parent, args) => 'Hello World'
			}
		})
	})
})

app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphql: true
}))

app.listen(5000, () => {
	console.log('Server Running...')
})

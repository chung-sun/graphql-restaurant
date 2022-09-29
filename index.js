const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

let restaurants = [
    {
      "id": 1,
      "name": "WoodsHill ",
      "description": "American cuisine, farm to table, with fresh produce every day",
      "dishes": [
        {
          "name": "Swordfish grill",
          "price": 27
        },
        {
          "name": "Roasted Broccily ",
          "price": 11
        }
      ]
    },
    {
      "id": 2,
      "name": "Fiorellas",
      "description": "Italian-American home cooked food with fresh pasta and sauces",
      "dishes": [
        {
          "name": "Flatbread",
          "price": 14
        },
        {
          "name": "Carbonara",
          "price": 18
        },
        {
          "name": "Spaghetti",
          "price": 19
        }
      ]
    },
    {
      "id": 3,
      "name": "Karma",
      "description": "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
      "dishes": [
        {
          "name": "Dragon Roll",
          "price": 12
        },
        {
          "name": "Pancake roll ",
          "price": 11
        },
        {
          "name": "Cod cakes",
          "price": 13
        }
      ]
    }
]

let newId = restaurants.length + 1;

let schema = buildSchema(`
    type Query {
        restaurant(id: Int) : Restaurant
        restaurants: [Restaurant]
    },
    type Restaurant {
        id: Int
        name: String
        description: String
        dishes: [Dish]
    },
    type Dish {
        name: String
        price: Int
    },
    input restaurantInput {
        id: Int
        name: String
        description: String
    },
    type DeleteResponse {
        ok: Boolean!
    }
    type Mutation {
        setRestaurant(input: restaurantInput) : Restaurant

        deleteRestaurant(id: Int) : DeleteResponse

        editRestaurant(id: Int!, name: String, description: String) : Restaurant
    }
`);

let root = {
    // get a restaurant by id - id = restaurant array position
    restaurant: (arg) => restaurants[arg.id],
    // get all restaurants
    restaurants: () => restaurants,
    // add a new restaurant
    setRestaurant: ({ input }) => {
        console.log(restaurants.length + 1);
        restaurants.push({id: newId, name: input.name, description: input.description});
        newId++;
        return input
    },
    // delete a restaurant by id - id = restaurant array position
    deleteRestaurant: ({ id }) => {
        const ok = Boolean(restaurants[id]);
        let deletedRestaurant = restaurants[id]
        restaurants = restaurants.filter(item => (
            item.id !== id + 1
        ))
        console.log(JSON.stringify(deletedRestaurant))
        return {ok}
    },
    // edit a restaurant by id - id = restaurant array position
    editRestaurant: ({ id, ...restaurant }) => {
        if (!restaurants[id]) {
            throw new Error("Restaurant Does Not Exist")
        }
        restaurants[id] = {...restaurants[id], ...restaurant}
        return restaurants[id]
    },

};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const port = 5500;
app.listen(5500, () => 
  console.log("Running Graphql on Port:" + port)
);
const Boom = require('boom');
const Joi = require('joi');
const monk = require('monk')
require('dotenv').config()

// get the DBURL value 
const db = monk(process.env.DBURL)
// get or create a collection in mongo
const books = db.get('books')
const users = db.get('users')

module.exports = [
//books routes
{
   "method": 'GET',
    "path": '/books/',
    handler: async (request, reply) => {
      let docs = await books.find({});
        return docs
    }
},
{
  "method"  : "GET",
  "path"    : "/{books?}",
  "handler" : async (request, reply) => 
  {
    //user query request
    if(request.path == '/users')
    {
      var result= users.find(request.query)
      return result
    } 
    //books query request
    else if(request.path == '/books')
    {
      var result= books.find(request.query)
      return result
    }  
    //wrong address
    else
      return "Record Not Found. Check your query"
  }
},
{
  "method"  : "GET",
  "path"    : "/books/{id}",
  "handler" : async (request, reply) => 
  {
    const result = await books.findOne({  _id : request.params.id });
    if(result == null)
      return "Record not found";
    else
      return result;
  }
},
{
  "method"  : "POST",
  "path"    : "/books/",
  "handler" : async (request, reply) => 
  {
    books.insert(request.payload);
    return request.payload;
  },
  config: 
  {
    validate: {
    payload: {
    title: Joi.string().min(5).max(50).required(),
    author: Joi.string().min(5).max(50).required(),
    isbn: Joi.string().required(),
    genre: Joi.string(),
    publication_information: Joi.object(),
    availability: Joi.string()
    }
    }
  }
 },
 {
    "method"  : "PATCH",
    "path"    : "/books/{id}",
    "handler" : async (request, reply) => 
    {
      books.update({
      _id: request.params.id
      }, {
      $set: request.payload
      }, function (err, result)
      {
        if (err) {
          return Boom.wrap(err, 'Internal database error');
        }

        if (result.n === 0) {
          return Boom.notFound();
        }

      });
      return 'Books Record Updated Successfully';
    },
  config: 
  {
    validate: {
    payload: {
    title: Joi.string().min(5).max(50),
    author: Joi.string().min(5).max(50),
    isbn: Joi.string(),
    genre: Joi.string(),
    publication_information: Joi.object(),
    availability: Joi.string()
    }
    }
  }
},
{
  "method"  : "DELETE",
  "path"    : "/books/{id}",
  "handler" : async (request, reply) => 
  {
    books.remove({
     _id: request.params.id
    }, function (err, result) 
    {
      if (err) {
        return Boom.wrap(err, 'Internal database error');
      }
      if (result.n === 0) {
         return Boom.notFound();
      }
    });
    return 'Books Record Removed Successfully';
  }
},

//users routes
{
    "method"  : "GET",
    "path"    : "/users/",
    "handler" : async (request, reply) => 
    {
        let docs = await users.find()
        return docs     
    }
},
{
    "method"  : "POST",
    "path"    : "/users/",
    "handler" : async (request, reply) => 
    {
        users.insert(request.payload);
        return request.payload;
    },
        config: {
             validate: {
                payload: {
                    email: Joi.string().email().required(),
                    books_borrowed: Joi.object(),
                    books_reserved: Joi.string(),
                    late_fees: Joi.string()
                }
            }
        }
},
{
    "method"  : "GET",
    "path"    : "/users/{id}",
    "handler" : async (request, reply) =>
    {
        const result = await users.findOne({  _id : request.params.id });
        if(result == null)
            return "Record not found";
        else
            return result;
    }
},
{
    "method"  : "PATCH",
    "path"    : "/users/{id}",
    "handler" : async (request, reply) =>
    {
        users.update({
            _id: request.params.id
        }, {
            $set: request.payload
        }, function (err, result) {
            if (err) {
                return Boom.wrap(err, 'Internal database error');
            }

            if (result.n === 0) {
                return Boom.notFound();
            }

        });
        return 'Users Record Updated Successfully';
    },
        config: {
             validate: {
                payload: {
                    email: Joi.string().email(),
                    books_borrowed: Joi.object(),
                    books_reserved: Joi.number(),
                    late_fees: Joi.number()
                }
            }
        }
},
{
    "method"  : "DELETE",
    "path"    : "/users/{id}",
    "handler" : async (request, reply) => 
    {
        users.remove({
            _id: request.params.id
        }, function (err, result) {

            if (err) {
                return Boom.wrap(err, 'Internal database error');
            }

            if (result.n === 0) {
                return Boom.notFound();
            }

        });
        return 'Users Record Removed Successfully';
    }
}
]

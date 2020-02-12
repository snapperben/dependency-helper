# dependencyHelper
A tool to help manage dependencies between objects

## Object dependence
When an object is a composition of one or more other objects, in order to create that object the other objects 
will need to know who their parent is.

This can be done by first creating the object and then, once the id of that project is known, all of it's dependencies
can be updated with that id. The problem with this approach in a front end environment is that it takes many round 
trips to the server and back.

What this tool does is to allow all the objects to be created at once and to allow the subject object to be saved to 
the database. Once that object has been successfully assigned a permanent id in the database, all of it's 
dependencies can be updated with that id. 

This really makes sense in a FE situation as it allows all objects to be created in a single user interaction
and therefore really give the appearance of a lot of speed. Not only does that look good to the user but it 
also allows the user to immediately get on with their stuff once control is passed back to them without the issues
of their updates being lost or those updates overwriting the final configuration of new items created. 

## Sagas
This tool can be very useful to allow the fine control of a saga (AKA transaction)

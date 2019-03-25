const Joi = require('joi');
const express = require('express');
const api = express();
api.use(express.json());

const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'},
];


api.get('/', (req, res) => {
    res.send('Hello World')
});


api.get('/api/courses', (req, res) => {
    res.send(courses);
});

api.get('/api/courses/:id', (req, res) => {
 const course = courses.find(c => c.id === parseInt(req.params.id));
 if(!course) return res.status(404).send('The course with the given Id was not found.');
res.send(course);
});

api.post('/api/courses', (req, res) => {
    
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    const course = { 
        id: courses.length + 1 ,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

api.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given Id was not found.');
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);

    if(error) return res.status(400).send(error.details[0].message); 
    course.name = req.body.name;
    res.send(course);
});

api.delete('/api/courses/:id', (req, res) =>{
    //look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given Id was not found.');
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //response
    res.send(course);
});
const port = process.env.PORT || 8080;
api.listen(port, () => console.log(`Listening on port ${port}...`));




function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}



const express = require('express');
const { resolve } = require('path');

const app = express();
let { sequelize } = require('./lib/index');
let { post } = require('./models/post.model');

app.use(express.json());

let postData = [
  {
    title: 'Getting Started with Node.js',
    content:
      'This post will guide you through the basics of Node.js and how to set up a Node.js project.',
    author: 'Alice Smith',
  },
  {
    title: 'Advanced Express.js Techniques',
    content:
      'Learn advanced techniques and best practices for building applications with Express.js.',
    author: 'Bob Johnson',
  },
  {
    title: 'ORM with Sequelize',
    content:
      'An introduction to using Sequelize as an ORM for Node.js applications.',
    author: 'Charlie Brown',
  },
  {
    title: 'Boost Your JavaScript Skills',
    content:
      'A collection of useful tips and tricks to improve your JavaScript programming.',
    author: 'Dana White',
  },
  {
    title: 'Designing RESTful Services',
    content: 'Guidelines and best practices for designing RESTful APIs.',
    author: 'Evan Davis',
  },
  {
    title: 'Mastering Asynchronous JavaScript',
    content:
      'Understand the concepts and patterns for writing asynchronous code in JavaScript.',
    author: 'Fiona Green',
  },
  {
    title: 'Modern Front-end Technologies',
    content:
      'Explore the latest tools and frameworks for front-end development.',
    author: 'George King',
  },
  {
    title: 'Advanced CSS Layouts',
    content: 'Learn how to create complex layouts using CSS Grid and Flexbox.',
    author: 'Hannah Lewis',
  },
  {
    title: 'Getting Started with React',
    content: "A beginner's guide to building user interfaces with React.",
    author: 'Ian Clark',
  },
  {
    title: 'Writing Testable JavaScript Code',
    content:
      'An introduction to unit testing and test-driven development in JavaScript.',
    author: 'Jane Miller',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await post.bulkCreate(postData);

    res.status(200).json({ message: 'Database seeding successfull' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

//Function to fetch all posts in the database
async function fetchAllPosts() {
  let posts = await post.findAll();
  return { posts };
}

//Endpoint 1: Fetch all posts
app.get('/posts', async (req, res) => {
  try {
    let response = await fetchAllPosts();

    if (response.posts.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Function to insert the new post into the database
async function addNewPost(newPost) {
  let response = await post.create(newPost);

  return { response };
}

//Endpoint 2: Add a new post in the database
app.post('/posts/new', async (req, res) => {
  try {
    let newPost = req.body.newPost;
    let response = await addNewPost(newPost);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Function to update the post in the database
async function updatePostById(updatedPostData, id) {
  let postDetails = await post.findOne({ where: { id } });

  if (!postDetails) {
    return {};
  }

  postDetails.set(updatedPostData);
  let updatedPost = await postDetails.save();

  return { message: 'Post updated successfully', updatedPost };
}

//Endpoint 3: Update post information
app.post('/posts/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newPostData = req.body;

    let response = await updatePostById(newPostData, id);

    if (!response.message) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Function to delete the post in the database
async function deletePostById(id) {
  let deletedPost = await post.destroy({ where: { id } });

  if (deletedPost === 0) {
    return {};
  }

  return { message: 'Post record deleted successfully' };
}

//Endpoint 4: Delete a post from the database
app.post('/posts/delete', async (req, res) => {
  try {
    let id = parseInt(req.body.id);

    let response = await deletePostById(id);
    if (!response.message) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

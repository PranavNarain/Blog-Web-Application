import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//show page with blogs
app.get("/allBlogs", (req, res) => {
  res.render("blogsPage.ejs", { blogs: blogs });
});

//Show the form to create the blog
app.get("/writeBlog", (req, res) => {
  res.render("blogs.ejs");
});

// View a specific form
app.get("/view-blog", (req, res) => {
  // Convert query index to integer
  const blogIndex = parseInt(req.query.blogIndex, 10);

  // Index validation to avoid errors
  if (isNaN(blogIndex) || blogIndex < 0 || blogIndex >= blogs.length) {
    res.status(404).send("Blog no encontrado"); // Error if index is invalid
  } else {
    const blog = blogs[blogIndex]; // Getting the blog from the corresponding index

    const escapeHTML = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Escape blog content to avoid incorrect interpretations
    const escapedContent = escapeHTML(blog.content);

    // Replace line breaks with <br> to preserve formatting
    const formattedContent = escapedContent.replace(/\n/g, "<br>");

    //Sending blog content to the user
    res.render("viewBlog.ejs", {
      title: blog.title,
      author: blog.author,
      date: blog.date,
      content: formattedContent,
    });
  }
});

//Create a new blog
app.post("/blog", (req, res) => {
  const newBlog = {
    title: req.body["title"],
    author: req.body["author"],
    content: req.body["content"],
    date: `${date.toLocaleString("en", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`,
  };
  blogs.push(newBlog);
  res.render("blogsPage.ejs", { blogs: blogs });
});

//Show the blog information you want to edit
let blogEditIndex;
app.post("/editPage", (req, res) => {
  blogEditIndex = req.body["blogIndex"];
  // Find the blog to edit
  const blogEdit = blogs.slice(blogEditIndex)[0];
  res.render("blogs.ejs", { blogEdit: blogEdit });
});

//Edit the specified blog
app.post("/editBlog", (req, res) => {
  const blogToEdit = blogs[blogEditIndex];
  //Update the blog with the new changes
  blogToEdit.title = req.body["title"];
  blogToEdit.author = req.body["author"];
  blogToEdit.content = req.body["content"];
  res.render("blogsPage.ejs", { blogs: blogs });
});

//Delete blog
app.post("/delete-blog", (req, res) => {
  const blogIndex = req.body["blogIndex"];
  // Delete the blog from the arrangement
  blogs.splice(blogIndex, 1);
  res.render("blogsPage.ejs", { blogs: blogs });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const date = new Date();

//Create test blogs
const blogs = [];
blogs.push({
  title: "Sample blog post 1",
  author: "Pranav Narain",
  content:
    "Never give up! keep doing what you are feel to do.",
  date: `August 15, 2024`,
});

blogs.push({
  title: "Testing Blog-2",
  author: "Pranav Devarakonda",
  content:
    "Surround yourself with people who challenge you, teach you, and push you to be your best self.",
  date: `August 18, 2024`,
});

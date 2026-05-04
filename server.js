const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let users = [];

function validateUser(body) {
  const errors = {};
  if (!body.fullName || body.fullName.trim().length < 3)
    errors.fullName = 'Full name must be at least 3 characters';
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email))
    errors.email = 'Valid email is required';
  if (!body.password || body.password.length < 6)
    errors.password = 'Password must be at least 6 characters';
  if (body.password !== body.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  if (!body.phone || !/^\d{10}$/.test(body.phone))
    errors.phone = 'Valid 10-digit phone is required';
  if (!body.dob)
    errors.dob = 'Date of birth is required';
  if (!body.gender)
    errors.gender = 'Please select a gender';
  if (!body.agreeTerms)
    errors.agreeTerms = 'You must agree to terms';
  return errors;
}

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Registration Form',
    users: users,
    errors: {},
    formData: {},
    success: req.query.success === '1',
    newUser: req.query.user || null,
  });
});

app.post('/register', (req, res) => {
  const errors = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.render('index', {
      title: 'Registration Form',
      users: users,
      errors: errors,
      formData: req.body,
      success: false,
      newUser: null,
    });
  }
  const newUser = {
    id: users.length + 1,
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: req.body.phone,
    dob: req.body.dob,
    gender: req.body.gender,
    createdAt: new Date().toLocaleString(),
  };
  users.unshift(newUser);
  res.redirect('/?success=1&user=' + encodeURIComponent(newUser.fullName));
});

app.post('/clear', (req, res) => {
  users = [];
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
});
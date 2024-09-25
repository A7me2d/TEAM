


const apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/study';
let data = [];



let user;
let pass;
let userofmaster;

fetch(apiUrl)
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData; 
    
    user = data[0].user;
    userofmaster = data[0].username;
    pass = data[0].pass;

  })
  .catch(error => console.error('Error fetching data:', error));



document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const hashedPassword = CryptoJS.SHA256(password).toString();
    // console.log(userofmaster);

    if (email === user && hashedPassword === pass) {
      window.location.href = 'web.html' , userofmaster;
    } else {
      document.getElementById('error').style.display = 'block';
    }
  });



 
  
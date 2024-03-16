const token_error = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>User Token Error</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
<style>
body {
    font-family: 'Poppins', sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    margin: 0;
}

.container {
    max-width: 600px;
    margin: auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding: 40px;
    text-align: center;
}

h2 {
    color: #1F1F26;
    font-size: 32px;
    margin-bottom: 20px;
}

p {
    color: #666;
    margin-bottom: 20px;
    font-size: 18px;
}

.centered-image {
    text-align: center;
    margin-bottom: 20px;
}

.centered-image img {
    max-width: 600px;
    height: 200px;
    border-radius: 10px;
    display: inline-block;
}

.resend-link {
    margin-top: 30px;
}

.resend-link button {
    background-color: #4E2FD7;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
</head>
<body>

<div class="container">
    <h2>User Token error</h2>
    <div class="centered-image">
        <img src="https://img.freepik.com/free-vector/error-404-concept-landing-page_52683-13616.jpg?t=st=1710612262~exp=1710615862~hmac=8f553e6d94bcd95d8c7b24d591e1d5992491bcb7e3ec35f3af98f95a4e394209&w=996" alt="Image" style="border-radius: 10px;">
    </div>
    <p>We're sorry, but it seems that your user token is missing or invalid.</p>
    <p>Please make sure you have the correct user token and try again. If the issue persists, contact support for assistance.</p>
</div>
</body>
</html>
`

module.exports = token_error;
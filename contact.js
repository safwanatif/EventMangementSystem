if(document.getElementById('contactForm')){
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
}
function handleContactForm(e) {
    e.preventDefault();

    // Collect form data
    let formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('message', document.getElementById('message').value);

    // Send data to the server
fetch('http://localhost:3001/contact', {
    method: 'POST',
    body: formData
})
.then(response => response.text())
.then(data => {
    alert(data);
    document.getElementById('contactForm').reset();
})
.catch(error => console.error('Error:', error));

}
/*
document.getElementById('contactForm').addEventListener('submit', handleContactForm);
}
function handleContactForm(e) {
    e.preventDefault();

    // Collect form data
    let formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('message', document.getElementById('message').value);

    // Check the collected form data
    console.log("Form Data:", {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    });

    // Send data to the server
    fetch('http://localhost:3001/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('contactForm').reset();
    })
    .catch(error => console.error('Error:', error));
}

*/
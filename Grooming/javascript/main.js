// Function to open the navigation side panel
function openNav() {
    document.getElementById("mySidenav").style.width = "50%";
}

// Function to close the navigation side panel
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Event listener to close modal on background click
document.body.addEventListener('click', function (event) {
    let modals = document.getElementsByClassName('modal');
    for (const element of modals) {
        if (event.target === element) {
            element.style.display = 'none';
        }
    }
});

// Function to submit user login data
function submitUser(event) {
    event.preventDefault();

    if (!validateSignUpForm()) return; // Check validation

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('/submit_form', { // Update the URL to point to your server endpoint
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            alert('Form submitted successfully');
        } else {
            alert('Failed to submit form: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form. Please try again.');
    });

    document.getElementById('loginModal').style.display = 'none';
}

// Function to submit dog details
function submitDogDetails() {
    let dogName = document.getElementById('dogName').value;
    let breed = document.getElementById('breedSelect').value;
    let age = document.getElementById('age').value;

    if (!validateDogDetailsForm()) return; // Check validation

    let formData = new FormData();
    formData.append('dog_name', dogName);
    formData.append('breed', breed);
    formData.append('age', age);

    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the dog details. Please try again.');
    });

    document.getElementById('dogDetailsModal').style.display = 'none';
}

// Function to handle user signup
function signupUser(event) {
    event.preventDefault();

    if (!validateSignUpForm()) return; // Check validation

    let username = document.getElementById('userName').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('paswd').value;

    let formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while signing up. Please try again.');
    });

    document.getElementById('signupModal').style.display = 'none';
}

// Function to show the dog details form after signup
function showDogDetailsForm() {
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('dogDetailsModal').style.display = 'block';
}

// Validation function for the signup form
function validateSignUpForm() {
    let username = document.getElementById('userName').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('paswd').value;

    if (username === '' || email === '' || password === '') {
        alert('Please fill in all fields.');
        return false;
    }

    return true;
}

// Validation function for the dog details form
function validateDogDetailsForm() {
    let dogName = document.getElementById('dogName').value;
    let breed = document.getElementById('breedSelect').value;
    let age = document.getElementById('age').value;

    if (dogName === '' || breed === '' || age === '') {
        alert('Please fill in all fields.');
        return false;
    }

    return true;
}

// Function to filter breed options based on user input
function filterBreeds() {
    let input = document.getElementById('breedSearch').value.toUpperCase();
    let select = document.getElementById('breedSelect');
    let options = select.getElementsByTagName('option');

    for (const element of options) {
        let option = element;
        let txtValue = option.textContent || option.innerText;

        if (txtValue.toUpperCase().indexOf(input) > -1) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
}

// Event listeners for modal and form interactions
document.getElementById('signupCancelBtn').addEventListener('click', function() {
    document.getElementById('signupModal').style.display = 'none';
});

document.getElementById('signupNextBtn').addEventListener('click', showDogDetailsForm);

document.getElementById('dogDetailsSubmitBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to submit the form?')) {
        submitDogDetails();
    }
});

document.getElementById('dogDetailsCancelBtn').addEventListener('click', function() {
    document.getElementById('dogDetailsModal').style.display = 'none';
});



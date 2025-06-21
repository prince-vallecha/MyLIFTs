<?php
include("/js/db.php"); // make sure this path is correct

$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirmPassword = $_POST['conformpassword']; // note the typo "conformpassword"

if ($password !== $confirmPassword) {
    echo "<script>alert('Passwords do not match.'); window.location.href='/signup.html';</script>";
    exit();
}

// OPTIONAL: Hash the password before saving (recommended for real apps)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if the email already exists
$check = $conn->prepare("SELECT * FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo "<script>alert('Email already registered. Please log in.'); window.location.href='/signup.html';</script>";
    exit();
}

// Insert new user into the database
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo "<script>alert('Registration successful! Please log in.'); window.location.href='/login.html';</script>";
} else {
    echo "<script>alert('Error during registration.'); window.location.href='../signup.html';</script>";
}

$conn->close();
?>

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDKgxJqorvDwAC6c3M4ZukLhNmrwRsG0s4",
  authDomain: "uwaste-sell-e15cb.firebaseapp.com",
  databaseURL: "https://uwaste-sell-e15cb-default-rtdb.firebaseio.com",
  projectId: "uwaste-sell-e15cb",
  storageBucket: "uwaste-sell-e15cb.appspot.com",
  messagingSenderId: "31811153608",
  appId: "1:31811153608:web:8a12fab94472fc88073ffd"
};

firebase.initializeApp(firebaseConfig);

// Reference your database
var uwasteDB = firebase.database().ref("uwaste-sell");

document.getElementById("selling").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  // Get form elements
  var form = document.getElementById('selling');
  var imageFile = form['image'].files[0]; // Get the selected image file

  // Upload the image file to Firebase Storage
  if (imageFile) {
      uploadImage(imageFile);
  } else {
      // If no image is selected, proceed without uploading an image
      saveMessages(null); // Pass null or empty string to saveMessages function
  }
}

function uploadImage(file) {
  // Reference to the storage service
  var storageRef = firebase.storage().ref();

  // Create a unique name for the image file
  var imageName = 'image_' + Date.now();

  // Upload file to Firebase Storage
  var uploadTask = storageRef.child('images/' + imageName).put(file);

  // Listen for state changes, errors, and completion of the upload
  uploadTask.on('state_changed',
      function(snapshot) {
          // Handle progress
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% complete');
      },
      function(error) {
          // Handle errors
          console.error('Error uploading image:', error);
      },
      function() {
          // Handle successful upload
          console.log('Image uploaded successfully');

          // Get the download URL of the uploaded image
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              // Save the download URL to the database or use it as needed
              saveMessages(downloadURL); // Assuming you have a function to save the download URL to the database
          });
      }
  );
}

const saveMessages = (imageUrl) => {
  var name = getElementVal('name');
  var waste = getElementVal('waste-type');
  var address = getElementVal('pickup-address');
  var date = getElementVal('pickup-date');
  var phone = getElementVal('phone');
  var product = getElementVal('product');
  console.log(name, waste, date, address, phone, imageUrl, product);

  var newUwasteDB = uwasteDB.push();

  newUwasteDB.set({
      name: name,
      waste: waste,
      date: date,
      address: address,
      phone: phone,
      image: imageUrl, // Pass the image URL to the database
      product: product,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
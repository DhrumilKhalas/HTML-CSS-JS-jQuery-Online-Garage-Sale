// Show the button when scrolled 100px from top.
window.onscroll = function () {

  const goToTopButton = document.getElementById("goToTopButton");

  if (
    document.documentElement.scrollTop > 100 ||
    document.body.scrollTop > 100
  ) {
    goToTopButton.style.display = "block";
  } else {
    goToTopButton.style.display = "none";
  }

};

// Smooth scroll back to top.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Validate the correct selection of items and populate the data in the "Order Summary".
function validateSelection() {

  const itemCards = document.querySelectorAll(".item-card");
  let isAtLeastOneChecked = false; // Flag to check if at least one item is selected
  let errorMessage = ""; // Variable to store error messages

  // Get error message element and clear any previous messages
  const errorMessageElement = document.getElementById("validSelectionError");

  errorMessageElement.textContent = ""; // Clear any previous messages
  errorMessageElement.style.display = "none"; // Hide the error message initially

  const selectedItems = []; // Array to hold selected item data

  // Loop through each item card to check selections and validate quantity
  for (let card of itemCards) {

    const checkbox = card.querySelector('input[type="checkbox"]');
    const quantityInput = card.querySelector('input[type="text"]');
    const nameOfItem = card.querySelector(".item-name").textContent;
    const priceOfEachItem =
      card.querySelector(".card-price-number").textContent;
    const descriptionOfEachItem =
      card.querySelector(".card-description").textContent;
    const imageSrc = card.querySelector("img").src;
    const altAttribute = card.querySelector("img").alt;

    // Check if checkbox is checked
    if (checkbox.checked) {

      isAtLeastOneChecked = true;

      // Validate quantity
      const quantityValue = quantityInput.value.trim();
      const quantityNumber = Number(quantityValue);

      // Check if quantity is a positive number
      if (
        quantityValue === "" ||
        quantityNumber <= 0 ||
        isNaN(quantityNumber)
      ) {
        errorMessage =
          "Quantity must be a positive number if an item is selected.";
        break; // Stop at the first error
      } else {
        // Store selected item and quantity
        selectedItems.push({
          id: checkbox.id,
          quantity: quantityNumber,
          itemName: nameOfItem,
          price: priceOfEachItem,
          description: descriptionOfEachItem,
          imageSrc: imageSrc,
          altAttribute: altAttribute,
        });
      }

    }

  }

  // Check if at least one checkbox is checked
  if (!isAtLeastOneChecked) {
    errorMessage = "Please select at least one item.";
  }

  // Display error message if any
  if (errorMessage) {

    errorMessageElement.textContent = errorMessage; // Set the new error message
    errorMessageElement.style.display = "block"; // Show the error message
    
  } else {

    // Display selected items in the payment section
    const paymentItemsContainer = document.getElementById("items");
    paymentItemsContainer.innerHTML = ""; // Clear any existing content
    let subtotal = 0; // Initialize subtotal

    // Loop through each selected item to create and display item elements
    selectedItems.forEach((item) => {

      const quantity = item.quantity;
      const price = item.price;
      const description = item.description;
      const itemName = item.itemName;
      const altAttribute = item.altAttribute;
      const imageSrc = item.imageSrc;

      subtotal += price * quantity; // Update subtotal with item cost

      // Create item HTML and append it to the payment items container
      const itemElement = document.createElement("section");
      itemElement.innerHTML = `
            <section class="item">
                <img src=${imageSrc} alt=${altAttribute} />
                <section class="item-details">
                    <section class="item-details-name-price">
                        <p class="purchased-item-name">${itemName}</p>
                        <p class="item-price">$${price}</p>  
                    </section>
                    <p class="item-description">${description}</p>
                    <p class="purchased-item-quantity">Quantity: ${quantity}</p>
                </section>
            </section>`;
      paymentItemsContainer.appendChild(itemElement); // Add item element to the container

    });

    // Update total items and totals
    document.querySelector(".total-items").textContent =
      selectedItems.length == 1 ? `1 item` : `${selectedItems.length} items`;
    document.querySelector(
      ".subtotal-amount"
    ).textContent = `$${subtotal.toFixed(2)}`;

    // Calculate donation (either $10 or 10% of subtotal, whichever is higher)
    const donationPercentage = 0.1;
    const donationAmount = Math.max(10, subtotal * donationPercentage);

    // Update the donation amount
    document.querySelector(
      ".donation-amount"
    ).textContent = `$${(donationAmount).toFixed(2)}`;

    // Update total to pay (add donation amount)
    const totalToPay = subtotal + donationAmount;
    document.querySelector(
      ".total-to-pay"
    ).textContent = `$${totalToPay.toFixed(2)}`;

    // Show the payment section
    document.getElementById("paymentSection").style.display = "flex";
    document.getElementById("items-payment-hr").style.display = "block";

  }

}

// Validate the correct submission of User Details form in the "Checkout".
function handleFormSubmission(event) {

  event.preventDefault(); // Prevent the default behaviour of form submission

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const creditCardNumber = document.getElementById("creditcardnumber").value;
  const creditCardExpiryMonth = document.getElementById(
    "creditcardexpirationmonth"
  ).value;
  const creditCardExpiryYear = document.getElementById(
    "creditcardexpirationyear"
  ).value;

  // Validate name
  const trimmedName = name.trim();

  // Check if name is provided and meets length and character requirements
  if (!trimmedName) {

    document.getElementById("nameError").innerText = "Name is required";
    document.getElementById("nameError").style.display = "block";
    return; // Exit the function

  } else if (trimmedName.length < 1 || trimmedName.length > 50) {

    document.getElementById("nameError").innerText =
      "Name must be between 1 and 50 characters";
    document.getElementById("nameError").style.display = "block";
    return; // Exit the function

  } else if (!/^[A-Za-z\s'-]+$/.test(trimmedName)) {

    document.getElementById("nameError").innerText =
      "Name can only contain letters, spaces, hyphens, and apostrophes";
    document.getElementById("nameError").style.display = "block";
    return; // Exit the function

  } else {

    document.getElementById("nameError").style.display = "none"; // Hide error

  }

  // Validate email
  const trimmedEmail = email.trim().toLowerCase();

  // Check if email is provided and valid
  if (!trimmedEmail) {

    document.getElementById("emailError").innerText = "Email is required";
    document.getElementById("emailError").style.display = "block";
    return; // Exit the function

  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {

    document.getElementById("emailError").innerText =
      "Please enter a valid email address";
    document.getElementById("emailError").style.display = "block";
    return; // Exit the function

  } else {

    document.getElementById("emailError").style.display = "none"; // Hide error

  }

  // Validate credit card number format
  const creditCardPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

  // Check if credit card number is provided and in the correct format
  if (!creditCardNumber) {

    document.getElementById("creditCardError").innerText =
      "Credit card number is required";
    document.getElementById("creditCardError").style.display = "block";
    return; // Exit the function

  } else if (creditCardNumber.trim() === "") {

    document.getElementById("creditCardError").innerText =
      "Credit card number cannot be empty";
    document.getElementById("creditCardError").style.display = "block";
    return; // Exit the function

  } else if (!creditCardPattern.test(creditCardNumber)) {

    document.getElementById("creditCardError").innerText =
      "Credit card number must be in format xxxx-xxxx-xxxx-xxxx and contain only digits";
    document.getElementById("creditCardError").style.display = "block";
    return; // Exit the function

  } else {

    document.getElementById("creditCardError").style.display = "none"; // Hide error

  }

  // Validate credit card expiration month format
  const trimmedExpiryMonth = creditCardExpiryMonth.trim();

  // Check if expiration month is provided and follows the required format
  if (!trimmedExpiryMonth) {

    document.getElementById("expiryMonthError").innerText =
      "Expiry month is required";
    document.getElementById("expiryMonthError").style.display = "block";
    return; // Exit the function

  } else if (
    !/^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/.test(
      trimmedExpiryMonth
    )
  ) {

    document.getElementById("expiryMonthError").innerText =
      "Expiry month must be in format MMM";
    document.getElementById("expiryMonthError").style.display = "block";
    return; // Exit the function

  } else {

    document.getElementById("expiryMonthError").style.display = "none"; // Hide error

  }

  // Validate credit card expiration year format
  const currentYear = new Date().getFullYear();
  const trimmedExpiryYear = creditCardExpiryYear.trim();

  // Check if expiration year is provided, is a valid 4-digit number, and is not in the past
  if (!trimmedExpiryYear) {

    document.getElementById("expiryYearError").innerText =
      "Expiry year is required";
    document.getElementById("expiryYearError").style.display = "block";
    return; // Exit the function

  } else if (!/^\d{4}$/.test(trimmedExpiryYear)) {

    document.getElementById("expiryYearError").innerText =
      "Expiry year must be a 4-digit number";
    document.getElementById("expiryYearError").style.display = "block";
    return; // Exit the function

  } else if (parseInt(trimmedExpiryYear) < currentYear) {

    document.getElementById("expiryYearError").innerText =
      "Expiry year cannot be in the past";
    document.getElementById("expiryYearError").style.display = "block";
    return; // Exit the function

  } else {

    document.getElementById("expiryYearError").style.display = "none"; // Hide error

  }

  // populate the data in the "Receipt" once all validation checks have been completed.

  // Update Name
  document.getElementById("receiptUserDetailsName").textContent = trimmedName;

  // Update Email
  document.getElementById("receiptUserDetailsEmail").textContent = trimmedEmail;

  // Update Credit Card Number to show only last 4 digits
  const lastFourDigits = creditCardNumber.slice(-4);
  document.getElementById("receiptUserDetailsCreditCardNumber").textContent =
    "****-****-****-" + lastFourDigits;

  const items = document.querySelectorAll(".item");
  const selectedItems = []; // Array to hold the data

  // Loop through each item
  items.forEach((item) => {

    const itemName = item.querySelector(".purchased-item-name").textContent;
    const itemQuantity = parseInt(
      item
        .querySelector(".purchased-item-quantity")
        .textContent.replace("Quantity: ", "")
        .trim()
    );
    const itemPrice = item.querySelector(".item-price").textContent;

    // Store the item data in the selectedItems array
    selectedItems.push({
      itemName: itemName,
      quantity: itemQuantity,
      price: itemPrice,
    });

  });

  // Retrieve donation and total amounts for receipt
  const donationAmount = document.querySelector(".donation-amount").textContent;
  const totalAmount = document.querySelector(".total-to-pay").textContent;
  const subTotalReceipt = document.querySelector(".subtotal-amount").textContent;

  // Populate the receipt table with selected items
  const tableBody = document.querySelector(".receipt-table tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  selectedItems.forEach((item) => {

    const lineTotal = item.quantity * parseFloat(item.price.replace('$', '')); // Calculate line total for each item
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.itemName}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>$${lineTotal.toFixed(2)}</td>
      `;
    tableBody.appendChild(row);

  });

  // Populate the footer (donation and total amount)
  const tableFooter = document.querySelector(".receipt-table tfoot");
  tableFooter.innerHTML = `
        <tr>
        <td colspan="3"><strong>Sub Total:</strong></td>
        <td><strong>${subTotalReceipt}</strong></td>
      </tr>
      <tr>
        <td colspan="3"><strong>Donation Amount:</strong></td>
        <td><strong>${donationAmount}</strong></td>
      </tr>
      <tr>
        <td colspan="3"><strong>Total:</strong></td>
        <td><strong class="total-amount-in-receipt">${totalAmount}</strong></td>
      </tr>
    `;

  // Show the receipt section
  document.querySelector(".receipt-section").style.display = "block";

  // Show the payment section
  document.getElementById("payment-receipt-hr").style.display = "block";

}

// Handle click of "Done" button
function handleClickDoneButton() {

  // Hide the payment section
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("items-payment-hr").style.display = "none";

  // Hide the receipt section
  document.getElementById("receiptSection").style.display = "none";
  document.getElementById("payment-receipt-hr").style.display = "none";

  // Get all item cards to reset their checkboxes and quantity inputs
  const itemCards = document.querySelectorAll(".item-card");

  // Loop through each item card to reset selections
  for (let card of itemCards) {

    const checkbox = card.querySelector('input[type="checkbox"]');
    const quantityInput = card.querySelector('input[type="text"]');

    checkbox.checked = false;
    quantityInput.value = "";

  }

  // Get all values related to the user from "Checkout" section and reset their input values
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("creditcardnumber").value = "";
  document.getElementById("creditcardexpirationmonth").value = "";
  document.getElementById("creditcardexpirationyear").value = "";
  
}

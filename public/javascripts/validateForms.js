  document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    let form = document.querySelector(".needs-validation");
  
    // Disable form submission if form validation fails
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      form.classList.add("was-validated");
    });
  
    // Add event listeners for input fields to validate on input
    let inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.checkValidity()) {
          input.classList.remove("is-invalid");
          input.classList.add("is-valid");
        } else {
          input.classList.remove("is-valid");
          input.classList.add("is-invalid");
        }
      });
    });
  });
  
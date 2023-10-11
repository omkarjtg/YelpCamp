document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const errorMessage = document.getElementById('error-message');

    fileInput.addEventListener('input', function() {
        validateFileFormats();
    });

    function validateFileFormats() {
        const allowedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
        const files = fileInput.files;
        let isValid = true;

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].name.toLowerCase();
            const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

            if (!allowedFormats.includes('.' + fileExtension)) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            // Proceed with file upload logic
            errorMessage.textContent = ''; // Clear any previous error messages
        } else {
            errorMessage.textContent = 'Invalid file format. Allowed formats: jpg, jpeg, png, webp';
            fileInput.value = ''; // Clear the selected files to prevent submission
        }
    }
});

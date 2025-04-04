document.addEventListener('DOMContentLoaded', () => {
    console.log("MyG Page Loaded!");

    // Example Function: Alert when clicking "Manage Products"
    document.querySelector('.btn-warning').addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'products.html';
    });
});

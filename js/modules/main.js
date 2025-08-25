// main.js
document.addEventListener('DOMContentLoaded', function() {
    initializeAppState();
    loadAllSections().then(() => {
        initSPANavigation();
        initTableHandling();
        initFormHandling();
    });
});
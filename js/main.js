// js/main.js
import { initializeAppState } from './modules/appState.js';
import { initSPANavigation, navigateTo, showReportsModal } from './modules/navigation.js';
import { initTableHandling } from './modules/tableHandling.js';
import { initFormHandling } from './modules/formHandling.js';
import { loadAllSections } from './modules/sectionLoader.js';
import { initDashboard, updateDashboardStats } from './components/sections/dashboard.js';
import { initCompanyModal } from './components/company-modal.js';
import { initReportsModal } from './components/reports-modal.js';
import { initSignatureModal } from './components/signature-modal.js';

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', async function() {
    try {
        initializeAppState();
        await loadAllSections();
        initSPANavigation();
        initTableHandling();
        initFormHandling();
        initDashboard();
        initCompanyModal();
        initReportsModal();
        initSignatureModal();
        
        // Pastikan dashboard diperbarui saat pertama kali dimuat
        updateDashboardStats();
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});
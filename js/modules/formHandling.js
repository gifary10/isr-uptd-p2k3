// js/modules/formHandling.js
import { P2K3AppState } from './appState.js';
import { navigateTo, navigateToNextSection, navigateToPrevSection } from './navigation.js';
import { validateSection } from './validation.js';
import { saveCompanyData, loadCompanyData, saveReport, collectFormData } from './storage.js';
import { updateDashboardStats } from '../components/sections/dashboard.js';

export const initFormHandling = () => {
    const nextSectionBtn = document.getElementById('next-section');
    const prevSectionBtn = document.getElementById('prev-section');
    const form = document.getElementById('p2k3-form');
    const saveCompanyBtn = document.getElementById('save-company-data');
    const generatePdfBtn = document.getElementById('generate-pdf');
    const submitFormBtn = document.getElementById('submit-form');
    
    if (nextSectionBtn) {
        nextSectionBtn.addEventListener('click', function() {
            const currentSection = P2K3AppState.currentSection;
            if (validateSection(currentSection)) {
                navigateToNextSection();
            }
        });
    }
    
    if (prevSectionBtn) {
        prevSectionBtn.addEventListener('click', navigateToPrevSection);
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateSection('section-e')) {
                saveReport();
                // Refresh dashboard setelah menyimpan
                setTimeout(() => {
                    updateDashboardStats();
                }, 100);
            }
        });
    }
    
    if (saveCompanyBtn) {
        saveCompanyBtn.addEventListener('click', saveCompanyData);
    }
    
    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', function() {
            alert('Fitur generate PDF akan segera tersedia.');
        });
    }
    
    if (submitFormBtn) {
        submitFormBtn.addEventListener('click', function() {
            if (validateSection('section-e')) {
                const confirmation = document.getElementById('confirmation-check');
                if (!confirmation || !confirmation.checked) {
                    alert('Harap centang konfirmasi sebelum mengirim laporan.');
                    return;
                }
                saveReport();
                // Refresh dashboard setelah menyimpan
                setTimeout(() => {
                    updateDashboardStats();
                }, 100);
            }
        });
    }
    
    // Load saved company data if exists
    loadCompanyData();
    
    // Setup event listeners for dynamic calculations
    setupStatisticsCalculations();
};

export const resetForm = () => {
    const form = document.getElementById('p2k3-form');
    if (form) form.reset();
    
    // Reset tables to one row each
    const tableIds = ['p2k3-members-a', 'meetings', 'inspections', 'trainings', 'plans'];
    
    tableIds.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        // Remove all rows except the first one
        while (tbody.rows.length > 1) {
            tbody.deleteRow(1);
        }
        
        // Clear the first row
        if (tbody.rows.length > 0) {
            tbody.rows[0].querySelectorAll('input, textarea, select').forEach(input => {
                input.value = '';
            });
        }
    });
    
    // Reset company data
    P2K3AppState.reportData.company = null;
    
    // Reset progress
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');
    }
    
    // Reset navigation
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-section') === 'dashboard') {
            button.classList.add('active');
        }
    });
    
    // Show dashboard
    navigateTo('dashboard');
};

const setupStatisticsCalculations = () => {
    // Setup event listeners for automatic calculations in section B
    const calculationFields = ['total-hours', 'accidents', 'lost-days', 'occupational-diseases', 'near-misses'];
    
    calculationFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', calculateStatistics);
        }
    });
};

const calculateStatistics = () => {
    const totalHours = parseFloat(document.getElementById('total-hours').value) || 0;
    const accidents = parseFloat(document.getElementById('accidents').value) || 0;
    const lostDays = parseFloat(document.getElementById('lost-days').value) || 0;
    const occupationalDiseases = parseFloat(document.getElementById('occupational-diseases').value) || 0;
    const nearMisses = parseFloat(document.getElementById('near-misses').value) || 0;
    
    // Calculate frequency rate (per 1,000,000 man hours)
    const frequencyRate = totalHours > 0 ? ((accidents + occupationalDiseases) * 1000000) / totalHours : 0;
    
    // Calculate severity rate (per 1,000 man hours)
    const severityRate = totalHours > 0 ? (lostDays * 1000) / totalHours : 0;
    
    // Calculate average severity rate
    const totalCases = accidents + occupationalDiseases;
    const averageSeverityRate = totalCases > 0 ? lostDays / totalCases : 0;
    
    // Update the result displays
    const frequencyRateElement = document.getElementById('frequency-rate');
    const severityRateElement = document.getElementById('severity-rate');
    const averageSeverityRateElement = document.getElementById('average-severity-rate');
    
    if (frequencyRateElement) {
        frequencyRateElement.textContent = frequencyRate.toFixed(2);
    }
    
    if (severityRateElement) {
        severityRateElement.textContent = severityRate.toFixed(2);
    }
    
    if (averageSeverityRateElement) {
        averageSeverityRateElement.textContent = averageSeverityRate.toFixed(2);
    }
};
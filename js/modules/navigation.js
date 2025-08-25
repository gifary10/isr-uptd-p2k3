// js/modules/navigation.js
import { P2K3AppState } from './appState.js';
import { loadSectionContent } from './sectionLoader.js';
import { initTableHandling } from './tableHandling.js';
import { resetForm } from './formHandling.js';
import { updateDashboardStats } from '../components/sections/dashboard.js';

export const navigateToNextSection = () => {
    const currentSection = P2K3AppState.currentSection;
    const sections = ['section-a', 'section-b', 'section-c', 'section-d', 'section-e'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        navigateTo(sections[currentIndex + 1]);
    }
};

export const navigateToPrevSection = () => {
    const currentSection = P2K3AppState.currentSection;
    const sections = ['section-a', 'section-b', 'section-c', 'section-d', 'section-e'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
        navigateTo(sections[currentIndex - 1]);
    } else if (currentIndex === 0) {
        navigateTo('dashboard');
    }
};

export const initSPANavigation = () => {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            navigateTo(targetSection);
        });
    });
};

export const navigateTo = async (sectionId) => {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-section') === sectionId) {
            button.classList.add('active');
        }
    });
    
    if (sectionId === 'dashboard') {
        const formProgress = document.getElementById('form-progress');
        const form = document.getElementById('p2k3-form');
        const dashboard = document.getElementById('dashboard');
        
        if (formProgress) formProgress.style.display = 'none';
        if (form) form.style.display = 'none';
        if (dashboard) {
            dashboard.style.display = 'block';
            dashboard.classList.add('active-section');
            // Refresh dashboard stats
            updateDashboardStats();
        }
    } else {
        const formProgress = document.getElementById('form-progress');
        const form = document.getElementById('p2k3-form');
        const dashboard = document.getElementById('dashboard');
        
        if (formProgress) formProgress.style.display = 'block';
        if (form) form.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
        
        // Load section content if not already loaded
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement && sectionElement.innerHTML.trim() === '') {
            await loadSectionContent(sectionId);
            
            // Re-initialize table handling for the loaded section
            if (sectionId === 'section-a' || sectionId === 'section-c' || sectionId === 'section-d') {
                initTableHandling();
            }
            
            // Setup calculations for section B
            if (sectionId === 'section-b') {
                const calculationFields = ['total-hours', 'accidents', 'lost-days', 'occupational-diseases', 'near-misses'];
                
                calculationFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.addEventListener('input', calculateStatistics);
                    }
                });
                
                // Calculate initial values
                calculateStatistics();
            }
        }
        
        if (sectionElement) {
            sectionElement.classList.add('active-section');
        }
        
        updateProgress(sectionId.split('-')[1]);
    }
    
    P2K3AppState.currentSection = sectionId;
    window.scrollTo(0, 0);
};

const updateProgress = (sectionId) => {
    const progressValues = {
        'a': 20,
        'b': 40,
        'c': 60,
        'd': 80,
        'e': 100 
    };
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressValues[sectionId]}%`;
        progressBar.setAttribute('aria-valuenow', progressValues[sectionId]);
    }
    
    updateNavigationButtons(sectionId);
    
    const sectionEButtons = document.getElementById('section-e-buttons');
    const nextSectionBtn = document.getElementById('next-section');
    
    if (sectionId === 'e') {
        if (sectionEButtons) sectionEButtons.style.display = 'flex';
        if (nextSectionBtn) nextSectionBtn.style.display = 'none';
    } else {
        if (sectionEButtons) sectionEButtons.style.display = 'none';
        if (nextSectionBtn) nextSectionBtn.style.display = 'block';
    }
};

const updateNavigationButtons = (sectionId) => {
    const prevButton = document.getElementById('prev-section');
    
    if (prevButton) {
        if (sectionId === 'a') {
            prevButton.style.visibility = 'hidden';
        } else {
            prevButton.style.visibility = 'visible';
        }
    }
};

// Helper function for statistics calculation
const calculateStatistics = () => {
    const totalHours = parseFloat(document.getElementById('total-hours').value) || 0;
    const accidents = parseFloat(document.getElementById('accidents').value) || 0;
    const lostDays = parseFloat(document.getElementById('lost-days').value) || 0;
    const occupationalDiseases = parseFloat(document.getElementById('occupational-diseases').value) || 0;
    
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

// Fungsi untuk menampilkan modal laporan
export const showReportsModal = () => {
    const modalContent = document.getElementById('reports-list-content');
    if (!modalContent) return;
    
    let html = '';
    
    if (P2K3AppState.savedReports.length === 0) {
        html = '<p class="text-center">Belum ada laporan</p>';
    } else {
        html = '<div class="list-group">';
        P2K3AppState.savedReports.forEach((report, index) => {
            const periodMap = {
                'q1': 'Triwulan I',
                'q2': 'Triwulan II',
                'q3': 'Triwulan III',
                'q4': 'Triwulan IV'
            };
            
            html += `
                <div class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${report.company ? report.company.name : 'Perusahaan'}</h5>
                        <small>${periodMap[report.reportIdentity ? report.reportIdentity.reportPeriod : 'q1']} ${report.reportIdentity ? report.reportIdentity.reportYear : new Date().getFullYear()}</small>
                    </div>
                    <p class="mb-1">Kecelakaan: ${report.statistics.accidents || 0}, Hampir Celaka: ${report.statistics.nearMisses || 0}</p>
                    <div class="btn-group btn-group-sm">
                        <button type="button" class="btn btn-outline-primary view-report-btn" data-index="${index}">
                            <i class="bi bi-eye"></i> Lihat
                        </button>
                        <button type="button" class="btn btn-outline-danger delete-report-btn" data-index="${index}">
                            <i class="bi bi-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    modalContent.innerHTML = html;
    
    // Menambahkan event listener untuk tombol lihat dan hapus
    document.querySelectorAll('.view-report-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            viewReport(index);
            const modal = bootstrap.Modal.getInstance(document.getElementById('reportsModal'));
            if (modal) modal.hide();
        });
    });
    
    document.querySelectorAll('.delete-report-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteReport(index);
        });
    });
    
    // Menampilkan modal
    const reportsModalElement = document.getElementById('reportsModal');
    if (reportsModalElement) {
        const reportsModal = new bootstrap.Modal(reportsModalElement);
        reportsModal.show();
    }
};

// Helper functions for report management
const viewReport = (index) => {
    const report = P2K3AppState.savedReports[index];
    if (!report) return;
    
    // TODO: Implement view report functionality
    alert(`Melihat laporan: ${report.company.name}`);
};

const deleteReport = (index) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
        P2K3AppState.savedReports.splice(index, 1);
        localStorage.setItem('p2k3-reports', JSON.stringify(P2K3AppState.savedReports));
        showReportsModal(); // Refresh the modal
        updateDashboardStats(); // Update dashboard
    }
};
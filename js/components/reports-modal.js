// js/components/reports-modal.js
import { showReportsModal } from '../modules/navigation.js';

export const initReportsModal = () => {
    const modalElement = document.getElementById('reportsModal');
    if (!modalElement) return;
    
    // Load modal content
    fetch('components/reports-modal.html')
        .then(response => response.text())
        .then(html => {
            modalElement.innerHTML = html;
            
            // Setup filter functionality
            const searchInput = document.getElementById('report-search');
            const yearFilter = document.getElementById('report-year-filter');
            const periodFilter = document.getElementById('report-period-filter');
            
            if (searchInput) {
                searchInput.addEventListener('input', filterReports);
            }
            
            if (yearFilter) {
                yearFilter.addEventListener('change', filterReports);
            }
            
            if (periodFilter) {
                periodFilter.addEventListener('change', filterReports);
            }
            
            // Initial load of reports
            showReportsModal();
        })
        .catch(error => {
            console.error('Error loading reports modal:', error);
            modalElement.innerHTML = `<div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reportsModalLabel">Daftar Laporan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Error loading content: ${error.message}</p>
                </div>
            </div>`;
        });
};

// Filter reports based on search and filter criteria
const filterReports = () => {
    const searchInput = document.getElementById('report-search');
    const yearFilter = document.getElementById('report-year-filter');
    const periodFilter = document.getElementById('report-period-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const yearValue = yearFilter ? yearFilter.value : '';
    const periodValue = periodFilter ? periodFilter.value : '';
    
    // Filter logic would be implemented here
    // For now, just refresh the modal
    showReportsModal();
};
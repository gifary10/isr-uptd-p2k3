// js/components/company-modal.js
import { saveCompanyData, loadCompanyData } from '../modules/storage.js';
import { initTableHandling } from '../modules/tableHandling.js';

export const initCompanyModal = () => {
    const modalElement = document.getElementById('companyIdentityModal');
    if (!modalElement) return;
    
    // Load modal content
    fetch('components/company-modal.html')
        .then(response => response.text())
        .then(html => {
            modalElement.innerHTML = html;
            
            // Initialize region dropdown functionality
            const regionSelect = document.getElementById('company-region');
            const otherRegionContainer = document.getElementById('other-region-container');
            const otherRegionInput = document.getElementById('other-region');
            
            if (regionSelect && otherRegionContainer && otherRegionInput) {
                regionSelect.addEventListener('change', function() {
                    if (this.value === 'other') {
                        otherRegionContainer.style.display = 'block';
                        otherRegionInput.setAttribute('required', 'required');
                    } else {
                        otherRegionContainer.style.display = 'none';
                        otherRegionInput.removeAttribute('required');
                        otherRegionInput.value = '';
                    }
                });
            }
            
            // Initialize table handling for members
            const addMemberBtn = document.getElementById('add-member');
            if (addMemberBtn) {
                addMemberBtn.addEventListener('click', function() {
                    const table = document.getElementById('p2k3-members');
                    if (!table) return;
                    
                    const tbody = table.querySelector('tbody');
                    if (!tbody || tbody.rows.length === 0) return;
                    
                    const newRow = tbody.rows[0].cloneNode(true);
                    
                    // Clear input values in the new row
                    newRow.querySelectorAll('input, select').forEach(input => {
                        if (input.type !== 'button') {
                            input.value = '';
                        }
                    });
                    
                    // Add event listener to the remove button
                    const removeButton = newRow.querySelector('.remove-row');
                    if (removeButton) {
                        removeButton.addEventListener('click', function() {
                            const row = this.closest('tr');
                            if (!row) return;
                            
                            const tbody = row.parentNode;
                            if (!tbody) return;
                            
                            if (tbody.querySelectorAll('tr').length > 1) {
                                tbody.removeChild(row);
                            } else {
                                alert('Tabel harus memiliki setidaknya satu baris.');
                            }
                        });
                    }
                    
                    tbody.appendChild(newRow);
                });
            }
            
            // Add event listeners to existing remove buttons
            document.querySelectorAll('.remove-row').forEach(button => {
                button.addEventListener('click', function() {
                    const row = this.closest('tr');
                    if (!row) return;
                    
                    const tbody = row.parentNode;
                    if (!tbody) return;
                    
                    if (tbody.querySelectorAll('tr').length > 1) {
                        tbody.removeChild(row);
                    } else {
                        alert('Tabel harus memiliki setidaknya satu baris.');
                    }
                });
            });
            
            // Load saved company data
            loadCompanyData();
            
            // Add event listener to save button
            const saveButton = document.getElementById('save-company-data');
            if (saveButton) {
                saveButton.addEventListener('click', saveCompanyData);
            }
        })
        .catch(error => {
            console.error('Error loading company modal:', error);
            modalElement.innerHTML = `<div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="companyIdentityModalLabel">Identitas Perusahaan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Error loading content: ${error.message}</p>
                </div>
            </div>`;
        });
};
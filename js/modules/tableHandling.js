// js/modules/tableHandling.js
export const initTableHandling = () => {
    setupTableButton('add-member', 'p2k3-members');
    setupTableButton('add-member-a', 'p2k3-members-a');
    setupTableButton('add-meeting', 'meetings');
    setupTableButton('add-inspection', 'inspections');
    setupTableButton('add-training', 'trainings');
    setupTableButton('add-plan', 'plans');
    
    // Inisialisasi event listener untuk tombol hapus yang sudah ada
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
};

const setupTableButton = (buttonId, tableId) => {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    button.addEventListener('click', function() {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody || tbody.rows.length === 0) return;
        
        const newRow = tbody.rows[0].cloneNode(true);
        
        // Clear input values in the new row
        newRow.querySelectorAll('input, textarea, select').forEach(input => {
            input.value = '';
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
};
// js/modules/utils.js
export const populateFormWithData = (data) => {
    // Populate statistics
    const totalHours = document.getElementById('total-hours');
    const accidents = document.getElementById('accidents');
    const lostDays = document.getElementById('lost-days');
    const occupationalDiseases = document.getElementById('occupational-diseases');
    const nearMisses = document.getElementById('near-misses');
    
    if (totalHours) totalHours.value = data.statistics.totalHours || '';
    if (accidents) accidents.value = data.statistics.accidents || '';
    if (lostDays) lostDays.value = data.statistics.lostDays || '';
    if (occupationalDiseases) occupationalDiseases.value = data.statistics.occupationalDiseases || '';
    if (nearMisses) nearMisses.value = data.statistics.nearMisses || '';
    
    // Populate evaluation
    const evaluation = document.getElementById('evaluation');
    if (evaluation) evaluation.value = data.evaluation.evaluation || '';
    
    // Populate closing
    const reportDate = document.getElementById('report-date');
    const p2k3Chairman = document.getElementById('p2k3-chairman');
    const p2k3Secretary = document.getElementById('p2k3-secretary');
    const companyRepresentative = document.getElementById('company-representative');
    
    if (reportDate) reportDate.value = data.closing.reportDate || '';
    if (p2k3Chairman) p2k3Chairman.value = data.closing.p2k3Chairman || '';
    if (p2k3Secretary) p2k3Secretary.value = data.closing.p2k3Secretary || '';
    if (companyRepresentative) companyRepresentative.value = data.closing.companyRepresentative || '';
    
    // Populate meetings table
    populateTable('meetings', data.activities.meetings, (row, item) => {
        const dateInput = row.querySelector('[name="meeting-date[]"]');
        const agendaInput = row.querySelector('[name="meeting-agenda[]"]');
        const resultInput = row.querySelector('[name="meeting-result[]"]');
        
        if (dateInput) dateInput.value = item.date || '';
        if (agendaInput) agendaInput.value = item.agenda || '';
        if (resultInput) resultInput.value = item.result || '';
    });
    
    // Populate inspections table
    populateTable('inspections', data.activities.inspections, (row, item) => {
        const typeInput = row.querySelector('[name="inspection-type[]"]');
        const frequencyInput = row.querySelector('[name="inspection-frequency[]"]');
        const findingsInput = row.querySelector('[name="inspection-findings[]"]');
        const followupInput = row.querySelector('[name="inspection-followup[]"]');
        
        if (typeInput) typeInput.value = item.type || '';
        if (frequencyInput) frequencyInput.value = item.frequency || '';
        if (findingsInput) findingsInput.value = item.findings || '';
        if (followupInput) followupInput.value = item.followup || '';
    });
    
    // Populate trainings table
    populateTable('trainings', data.activities.trainings, (row, item) => {
        const typeInput = row.querySelector('[name="training-type[]"]');
        const participantsInput = row.querySelector('[name="training-participants[]"]');
        const dateInput = row.querySelector('[name="training-date[]"]');
        const descriptionInput = row.querySelector('[name="training-description[]"]');
        
        if (typeInput) typeInput.value = item.type || '';
        if (participantsInput) participantsInput.value = item.participants || '';
        if (dateInput) dateInput.value = item.date || '';
        if (descriptionInput) descriptionInput.value = item.description || '';
    });
    
    // Populate plans table
    populateTable('plans', data.evaluation.plans, (row, item) => {
        const activityInput = row.querySelector('[name="plan-activity[]"]');
        const deadlineInput = row.querySelector('[name="plan-deadline[]"]');
        const personInput = row.querySelector('[name="plan-person[]"]');
        
        if (activityInput) activityInput.value = item.activity || '';
        if (deadlineInput) deadlineInput.value = item.deadline || '';
        if (personInput) personInput.value = item.person || '';
    });
};

const populateTable = (tableId, items, populateRow) => {
    const table = document.getElementById(tableId);
    if (!table || !items || items.length === 0) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows except the first one
    while (tbody.rows.length > 1) {
        tbody.deleteRow(1);
    }
    
    // Populate rows
    items.forEach((item, index) => {
        let row;
        if (index === 0 && tbody.rows.length > 0) {
            // Use the first row
            row = tbody.rows[0];
        } else {
            // Clone the first row for additional items
            row = tbody.rows[0].cloneNode(true);
            tbody.appendChild(row);
        }
        
        // Populate the row with data
        populateRow(row, item);
    });
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};
// js/modules/validation.js
export const validateSection = (sectionId) => {
    let isValid = true;
    
    switch (sectionId) {
        case 'section-a':  // Ditambahkan
            isValid = validateSectionA();
            break;
        case 'section-b':
            isValid = validateStatistics();
            break;
        case 'section-c':
            isValid = validateActivities();
            break;
        case 'section-d':
            isValid = validateEvaluation();
            break;
        case 'section-e':
            isValid = validateClosing();
            break;
    }
    
    return isValid;
};

const validateSectionA = () => {
    const requiredFields = [
        'report-number',
        'report-period-a',
        'report-year-a'
    ];
    
    return validateRequiredFields(requiredFields);
};

const validateStatistics = () => {
    const requiredFields = [
        'total-hours',
        'accidents',
        'lost-days',
        'occupational-diseases',
        'near-misses'
    ];
    
    return validateRequiredFields(requiredFields);
};

const validateActivities = () => {
    // Validasi tabel meetings
    const meetingsTable = document.getElementById('meetings');
    if (meetingsTable) {
        const tbody = meetingsTable.querySelector('tbody');
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            for (let i = 0; i < rows.length; i++) {
                const dateInput = rows[i].querySelector('[name="meeting-date[]"]');
                const agendaInput = rows[i].querySelector('[name="meeting-agenda[]"]');
                
                if (dateInput && dateInput.value.trim() === '' && agendaInput && agendaInput.value.trim() !== '') {
                    alert('Harap isi tanggal rapat untuk semua agenda yang diisi.');
                    return false;
                }
                
                if (agendaInput && agendaInput.value.trim() === '' && dateInput && dateInput.value.trim() !== '') {
                    alert('Harap isi agenda rapat untuk semua tanggal yang diisi.');
                    return false;
                }
            }
        }
    }
    
    return true;
};

const validateEvaluation = () => {
    const evaluation = document.getElementById('evaluation');
    if (evaluation && evaluation.value.trim() === '') {
        alert('Harap isi evaluasi program K3.');
        return false;
    }
    
    return true;
};

const validateClosing = () => {
    const requiredFields = [
        'report-date',
        'p2k3-chairman',
        'p2k3-secretary',
        'company-representative'
    ];
    
    return validateRequiredFields(requiredFields);
};

const validateRequiredFields = (fieldIds) => {
    for (const fieldId of fieldIds) {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            alert(`Harap isi field ${fieldId.replace(/-/g, ' ')}.`);
            return false;
        }
    }
    
    return true;
};
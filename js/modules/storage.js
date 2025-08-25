// js/modules/storage.js
import { P2K3AppState } from './appState.js';
import { navigateTo } from './navigation.js';
import { populateFormWithData } from './utils.js';

export const saveCompanyData = () => {
    const companyName = document.getElementById('company-name');
    const companyAddress = document.getElementById('company-address');
    const companyRegion = document.getElementById('company-region');
    const otherRegion = document.getElementById('other-region');
    const npwp = document.getElementById('npwp');
    const businessType = document.getElementById('business-type');
    const maleWorkers = document.getElementById('male-workers');
    const femaleWorkers = document.getElementById('female-workers');
    
    // Data dari Section A
    const reportNumber = document.getElementById('report-number');
    const reportPeriodA = document.getElementById('report-period-a');
    const reportYearA = document.getElementById('report-year-a');
    
    if (!companyName || !companyAddress || !companyRegion || !npwp || !businessType || 
        !maleWorkers || !femaleWorkers || !reportNumber || !reportPeriodA || !reportYearA) {
        alert('Beberapa elemen form tidak ditemukan');
        return;
    }
    
    // Handle logo upload
    const logoInput = document.getElementById('company-logo');
    let logoData = null;
    
    if (logoInput && logoInput.files.length > 0) {
        const file = logoInput.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file logo terlalu besar. Maksimal 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            logoData = e.target.result;
            completeSaveCompanyData(logoData);
        };
        reader.readAsDataURL(file);
    } else {
        completeSaveCompanyData(null);
    }
    
    function completeSaveCompanyData(logoData) {
        // Determine final region value
        let finalRegion = companyRegion.value;
        if (companyRegion.value === 'other' && otherRegion && otherRegion.value.trim() !== '') {
            finalRegion = otherRegion.value;
        }
        
        const companyData = {
            name: companyName.value,
            address: companyAddress.value,
            region: finalRegion,
            npwp: npwp.value,
            businessType: businessType.value,
            maleWorkers: maleWorkers.value,
            femaleWorkers: femaleWorkers.value,
            logo: logoData,
            // Data dari Section A
            reportNumber: reportNumber.value,
            reportPeriodA: reportPeriodA.value,
            reportYearA: reportYearA.value,
            members: []
        };
        
        const membersTable = document.getElementById('p2k3-members');
        if (membersTable) {
            const tbody = membersTable.querySelector('tbody');
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => {
                    const nameInput = row.querySelector('[name="member-name[]"]');
                    const positionInput = row.querySelector('[name="member-position[]"]');
                    const p2k3PositionInput = row.querySelector('[name="member-p2k3-position[]"]');
                    
                    if (nameInput && positionInput && p2k3PositionInput) {
                        companyData.members.push({
                            name: nameInput.value,
                            position: positionInput.value,
                            p2k3Position: p2k3PositionInput.value
                        });
                    }
                });
            }
        }
        
        // Simpan data anggota dari Section A
        const membersTableA = document.getElementById('p2k3-members-a');
        if (membersTableA) {
            const tbody = membersTableA.querySelector('tbody');
            if (tbody) {
                companyData.membersA = [];
                tbody.querySelectorAll('tr').forEach(row => {
                    const nameInput = row.querySelector('[name="member-name-a[]"]');
                    const positionInput = row.querySelector('[name="member-position-a[]"]');
                    const p2k3PositionInput = row.querySelector('[name="member-p2k3-position-a[]"]');
                    
                    if (nameInput && positionInput && p2k3PositionInput) {
                        companyData.membersA.push({
                            name: nameInput.value,
                            position: positionInput.value,
                            p2k3Position: p2k3PositionInput.value
                        });
                    }
                });
            }
        }
        
        P2K3AppState.reportData.company = companyData;
        localStorage.setItem('p2k3-company', JSON.stringify(companyData));
        
        alert('Data perusahaan berhasil disimpan!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('companyIdentityModal'));
        if (modal) modal.hide();
    }
};

export const loadCompanyData = () => {
    const savedData = localStorage.getItem('p2k3-company');
    if (savedData) {
        const companyData = JSON.parse(savedData);
        
        const companyName = document.getElementById('company-name');
        const companyAddress = document.getElementById('company-address');
        const companyRegion = document.getElementById('company-region');
        const otherRegion = document.getElementById('other-region');
        const otherRegionContainer = document.getElementById('other-region-container');
        const npwp = document.getElementById('npwp');
        const businessType = document.getElementById('business-type');
        const maleWorkers = document.getElementById('male-workers');
        const femaleWorkers = document.getElementById('female-workers');
        
        // Data dari Section A
        const reportNumber = document.getElementById('report-number');
        const reportPeriodA = document.getElementById('report-period-a');
        const reportYearA = document.getElementById('report-year-a');
        
        if (companyName) companyName.value = companyData.name || '';
        if (companyAddress) companyAddress.value = companyData.address || '';
        if (npwp) npwp.value = companyData.npwp || '';
        if (businessType) businessType.value = companyData.businessType || '';
        if (maleWorkers) maleWorkers.value = companyData.maleWorkers || '';
        if (femaleWorkers) femaleWorkers.value = companyData.femaleWorkers || '';
        
        // Load region data
        if (companyRegion) {
            const predefinedRegions = ['Kota Bekasi', 'Kab. Bekasi', 'Kab. Karawang', 'Kab. Purwakarta', 'Kab. Subang'];
            if (predefinedRegions.includes(companyData.region)) {
                companyRegion.value = companyData.region;
                if (otherRegionContainer) otherRegionContainer.style.display = 'none';
            } else {
                companyRegion.value = 'other';
                if (otherRegion) otherRegion.value = companyData.region || '';
                if (otherRegionContainer) otherRegionContainer.style.display = 'block';
            }
        }
        
        // Load data dari Section A
        if (reportNumber) reportNumber.value = companyData.reportNumber || '';
        if (reportPeriodA) reportPeriodA.value = companyData.reportPeriodA || '';
        if (reportYearA) reportYearA.value = companyData.reportYearA || '';
        
        // Clear existing member rows except the first one
        const membersTable = document.getElementById('p2k3-members');
        if (membersTable) {
            const tbody = membersTable.querySelector('tbody');
            if (tbody) {
                while (tbody.rows.length > 1) {
                    tbody.deleteRow(1);
                }
                
                // Add member rows
                if (companyData.members && companyData.members.length > 0) {
                    companyData.members.forEach((member, index) => {
                        if (index === 0 && tbody.rows.length > 0) {
                            // Update first row
                            const nameInput = tbody.rows[0].querySelector('[name="member-name[]"]');
                            const positionInput = tbody.rows[0].querySelector('[name="member-position[]"]');
                            const p2k3PositionInput = tbody.rows[0].querySelector('[name="member-p2k3-position[]"]');
                            
                            if (nameInput) nameInput.value = member.name || '';
                            if (positionInput) positionInput.value = member.position || '';
                            if (p2k3PositionInput) p2k3PositionInput.value = member.p2k3Position || '';
                        } else {
                            // Add new rows for additional members
                            const newRow = tbody.rows[0].cloneNode(true);
                            const nameInput = newRow.querySelector('[name="member-name[]"]');
                            const positionInput = newRow.querySelector('[name="member-position[]"]');
                            const p2k3PositionInput = newRow.querySelector('[name="member-p2k3-position[]"]');
                            
                            if (nameInput) nameInput.value = member.name || '';
                            if (positionInput) positionInput.value = member.position || '';
                            if (p2k3PositionInput) p2k3PositionInput.value = member.p2k3Position || '';
                            
                            tbody.appendChild(newRow);
                        }
                    });
                }
            }
        }
        
        // Load data anggota dari Section A
        const membersTableA = document.getElementById('p2k3-members-a');
        if (membersTableA) {
            const tbody = membersTableA.querySelector('tbody');
            if (tbody) {
                while (tbody.rows.length > 1) {
                    tbody.deleteRow(1);
                }
                
                // Add member rows untuk Section A
                if (companyData.membersA && companyData.membersA.length > 0) {
                    companyData.membersA.forEach((member, index) => {
                        if (index === 0 && tbody.rows.length > 0) {
                            // Update first row
                            const nameInput = tbody.rows[0].querySelector('[name="member-name-a[]"]');
                            const positionInput = tbody.rows[0].querySelector('[name="member-position-a[]"]');
                            const p2k3PositionInput = tbody.rows[0].querySelector('[name="member-p2k3-position-a[]"]');
                            
                            if (nameInput) nameInput.value = member.name || '';
                            if (positionInput) positionInput.value = member.position || '';
                            if (p2k3PositionInput) p2k3PositionInput.value = member.p2k3Position || '';
                        } else {
                            // Add new rows for additional members
                            const newRow = tbody.rows[0].cloneNode(true);
                            const nameInput = newRow.querySelector('[name="member-name-a[]"]');
                            const positionInput = newRow.querySelector('[name="member-position-a[]"]');
                            const p2k3PositionInput = newRow.querySelector('[name="member-p2k3-position-a[]"]');
                            
                            if (nameInput) nameInput.value = member.name || '';
                            if (positionInput) positionInput.value = member.position || '';
                            if (p2k3PositionInput) p2k3PositionInput.value = member.p2k3Position || '';
                            
                            tbody.appendChild(newRow);
                        }
                    });
                }
            }
        }
    }
};

// js/modules/storage.js - Perbaikan fungsi saveReport
export const saveReport = () => {
    // Collect data from form
    const formData = collectFormData();
    
    // Validasi data sebelum menyimpan
    if (!validateReportData(formData)) {
        alert('Harap isi semua data yang diperlukan sebelum menyimpan laporan.');
        return;
    }
    
    // Add to saved reports
    P2K3AppState.savedReports.push(formData);
    
    // Save to localStorage
    localStorage.setItem('p2k3-reports', JSON.stringify(P2K3AppState.savedReports));
    
    alert('Laporan berhasil disimpan!');
    navigateTo('dashboard');
    
    // Refresh dashboard setelah menyimpan
    updateDashboardStats();
};

// Fungsi validasi data laporan
const validateReportData = (data) => {
    // Validasi data perusahaan
    if (!data.company || !data.company.name || data.company.name.trim() === '') {
        return false;
    }
    
    // Validasi data statistik
    if (!data.statistics || 
        data.statistics.totalHours === '' || 
        data.statistics.accidents === '' || 
        data.statistics.lostDays === '' || 
        data.statistics.occupationalDiseases === '' || 
        data.statistics.nearMisses === '') {
        return false;
    }
    
    // Validasi data penutup
    if (!data.closing || 
        data.closing.reportDate === '' || 
        data.closing.p2k3Chairman === '' || 
        data.closing.p2k3Secretary === '') {
        return false;
    }
    
    return true;
};

export const collectFormData = () => {
    const totalHours = document.getElementById('total-hours');
    const accidents = document.getElementById('accidents');
    const lostDays = document.getElementById('lost-days');
    const occupationalDiseases = document.getElementById('occupational-diseases');
    const nearMisses = document.getElementById('near-misses');
    const evaluation = document.getElementById('evaluation');
    const reportDate = document.getElementById('report-date');
    const p2k3Chairman = document.getElementById('p2k3-chairman');
    const p2k3Secretary = document.getElementById('p2k3-secretary');
    const companyRepresentative = document.getElementById('company-representative');
    
    // Data dari Section A
    const reportNumber = document.getElementById('report-number');
    const reportPeriodA = document.getElementById('report-period-a');
    const reportYearA = document.getElementById('report-year-a');
    
    const formData = {
        company: P2K3AppState.reportData.company,
        // Data dari Section A
        reportIdentity: {
            reportNumber: reportNumber ? reportNumber.value : '',
            reportPeriod: reportPeriodA ? reportPeriodA.value : '',
            reportYear: reportYearA ? reportYearA.value : ''
        },
        statistics: {
            totalHours: totalHours ? totalHours.value : '',
            accidents: accidents ? accidents.value : '',
            lostDays: lostDays ? lostDays.value : '',
            occupationalDiseases: occupationalDiseases ? occupationalDiseases.value : '',
            nearMisses: nearMisses ? nearMisses.value : ''
        },
        activities: {
            meetings: [],
            inspections: [],
            trainings: []
        },
        evaluation: {
            evaluation: evaluation ? evaluation.value : '',
            plans: []
        },

        closing: {
            reportDate: reportDate ? reportDate.value : '',
            p2k3Chairman: p2k3Chairman ? p2k3Chairman.value : '',
            p2k3Secretary: p2k3Secretary ? p2k3Secretary.value : '',
            companyRepresentative: companyRepresentative ? companyRepresentative.value : '',
            p2k3ChairmanSignature: document.getElementById('p2k3-chairman-signature') ? document.getElementById('p2k3-chairman-signature').value : '',
            p2k3SecretarySignature: document.getElementById('p2k3-secretary-signature') ? document.getElementById('p2k3-secretary-signature').value : '',
            companyRepresentativeSignature: document.getElementById('company-representative-signature') ? document.getElementById('company-representative-signature').value : ''
        }
    };
    
    // Collect meetings data
    const meetingsTable = document.getElementById('meetings');
    if (meetingsTable) {
        const tbody = meetingsTable.querySelector('tbody');
        if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
                const dateInput = row.querySelector('[name="meeting-date[]"]');
                const agendaInput = row.querySelector('[name="meeting-agenda[]"]');
                const resultInput = row.querySelector('[name="meeting-result[]"]');
                
                if (dateInput && agendaInput && resultInput) {
                    formData.activities.meetings.push({
                        date: dateInput.value,
                        agenda: agendaInput.value,
                        result: resultInput.value
                    });
                }
            });
        }
    }
    
    // Collect inspections data
    const inspectionsTable = document.getElementById('inspections');
    if (inspectionsTable) {
        const tbody = inspectionsTable.querySelector('tbody');
        if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
                const typeInput = row.querySelector('[name="inspection-type[]"]');
                const frequencyInput = row.querySelector('[name="inspection-frequency[]"]');
                const findingsInput = row.querySelector('[name="inspection-findings[]"]');
                const followupInput = row.querySelector('[name="inspection-followup[]"]');
                
                if (typeInput && frequencyInput && findingsInput && followupInput) {
                    formData.activities.inspections.push({
                        type: typeInput.value,
                        frequency: frequencyInput.value,
                        findings: findingsInput.value,
                        followup: followupInput.value
                    });
                }
            });
        }
    }
    
    // Collect trainings data
    const trainingsTable = document.getElementById('trainings');
    if (trainingsTable) {
        const tbody = trainingsTable.querySelector('tbody');
        if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
                const typeInput = row.querySelector('[name="training-type[]"]');
                const participantsInput = row.querySelector('[name="training-participants[]"]');
                const dateInput = row.querySelector('[name="training-date[]"]');
                const descriptionInput = row.querySelector('[name="training-description[]"]');
                
                if (typeInput && participantsInput && dateInput && descriptionInput) {
                    formData.activities.trainings.push({
                        type: typeInput.value,
                        participants: participantsInput.value,
                        date: dateInput.value,
                        description: descriptionInput.value
                    });
                }
            });
        }
    }
    
    // Collect plans data
    const plansTable = document.getElementById('plans');
    if (plansTable) {
        const tbody = plansTable.querySelector('tbody');
        if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
                const activityInput = row.querySelector('[name="plan-activity[]"]');
                const deadlineInput = row.querySelector('[name="plan-deadline[]"]');
                const personInput = row.querySelector('[name="plan-person[]"]');
                
                if (activityInput && deadlineInput && personInput) {
                    formData.evaluation.plans.push({
                        activity: activityInput.value,
                        deadline: deadlineInput.value,
                        person: personInput.value
                    });
                }
            });
        }
    }
    
    // Collect data anggota dari Section A
    const membersTableA = document.getElementById('p2k3-members-a');
    if (membersTableA) {
        const tbody = membersTableA.querySelector('tbody');
        if (tbody) {
            formData.membersA = [];
            tbody.querySelectorAll('tr').forEach(row => {
                const nameInput = row.querySelector('[name="member-name-a[]"]');
                const positionInput = row.querySelector('[name="member-position-a[]"]');
                const p2k3PositionInput = row.querySelector('[name="member-p2k3-position-a[]"]');
                
                if (nameInput && positionInput && p2k3PositionInput) {
                    formData.membersA.push({
                        name: nameInput.value,
                        position: positionInput.value,
                        p2k3Position: p2k3PositionInput.value
                    });
                }
            });
        }
    }
    
    return formData;
};
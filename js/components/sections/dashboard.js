// js/components/sections/dashboard.js
import { P2K3AppState } from '../../modules/appState.js';
import { navigateTo } from '../../modules/navigation.js';
import { showReportsModal } from '../../modules/navigation.js';

export const initDashboard = () => {
    // Inisialisasi dashboard
    const newReportBtn = document.getElementById('btn-new-report');
    const viewReportsBtn = document.getElementById('btn-view-reports');
    
    if (newReportBtn) {
        newReportBtn.addEventListener('click', function() {
            navigateTo('section-a');
        });
    }
    
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', showReportsModal);
    }
    
    // Update stats saat pertama kali dimuat
    updateDashboardStats();
};

export const updateDashboardStats = () => {
    const statsElement = document.getElementById('dashboard-stats');
    const recentReportsList = document.getElementById('recent-reports-list');
    
    if (!statsElement || !recentReportsList) return;
    
    // Update statistik dashboard
    let statsHtml = '';
    let recentReportsHtml = '';
    
    if (P2K3AppState.savedReports.length === 0) {
        statsHtml = `
            <div class="col-md-12">
                <div class="card custom-card">
                    <div class="card-body text-center">
                        <i class="bi bi-file-text display-4 text-muted"></i>
                        <h5 class="card-title mt-3">Belum ada laporan</h5>
                        <p class="card-text">Mulai dengan membuat laporan baru</p>
                        <button id="btn-new-report" class="btn btn-primary">Buat Laporan Baru</button>
                    </div>
                </div>
            </div>
        `;
        
        recentReportsHtml = '<p class="text-center text-muted py-4">Belum ada laporan</p>';
    } else {
        const totalAccidents = P2K3AppState.savedReports.reduce((sum, report) => {
            return sum + (parseInt(report.statistics.accidents) || 0);
        }, 0);
        
        const totalNearMisses = P2K3AppState.savedReports.reduce((sum, report) => {
            return sum + (parseInt(report.statistics.nearMisses) || 0);
        }, 0);
        
        const totalInspections = P2K3AppState.savedReports.reduce((sum, report) => {
            return sum + (report.activities.inspections ? report.activities.inspections.length : 0);
        }, 0);
        
        const totalTrainings = P2K3AppState.savedReports.reduce((sum, report) => {
            return sum + (report.activities.trainings ? report.activities.trainings.length : 0);
        }, 0);
        
        statsHtml = `
            <div class="col-md-3">
                <div class="card custom-card">
                    <div class="card-body text-center">
                        <i class="bi bi-exclamation-triangle text-warning dashboard-icon"></i>
                        <h5 class="card-title mt-2">${totalAccidents}</h5>
                        <p class="card-text">Total Kecelakaan</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card custom-card">
                    <div class="card-body text-center">
                        <i class="bi bi-shield-exclamation text-info dashboard-icon"></i>
                        <h5 class="card-title mt-2">${totalNearMisses}</h5>
                        <p class="card-text">Hampir Celaka</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card custom-card">
                    <div class="card-body text-center">
                        <i class="bi bi-search text-primary dashboard-icon"></i>
                        <h5 class="card-title mt-2">${totalInspections}</h5>
                        <p class="card-text">Pemeriksaan</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card custom-card">
                    <div class="card-body text-center">
                        <i class="bi bi-mortarboard text-success dashboard-icon"></i>
                        <h5 class="card-title mt-2">${totalTrainings}</h5>
                        <p class="card-text">Pelatihan</p>
                    </div>
                </div>
            </div>
        `;
        
        // Tampilkan 5 laporan terbaru
        const recentReports = P2K3AppState.savedReports.slice(-5).reverse();
        recentReportsHtml = '<div class="list-group">';
        
        recentReports.forEach((report, index) => {
            const periodMap = {
                'q1': 'Triwulan I',
                'q2': 'Triwulan II', 
                'q3': 'Triwulan III',
                'q4': 'Triwulan IV'
            };
            
            const reportDate = new Date(report.closing.reportDate);
            const formattedDate = reportDate.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            
            recentReportsHtml += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${report.company.name}</h6>
                        <small>${formattedDate}</small>
                    </div>
                    <p class="mb-1 small">${periodMap[report.reportIdentity.reportPeriod]} ${report.reportIdentity.reportYear}</p>
                    <div class="d-flex justify-content-between">
                        <span class="badge bg-primary">Kecelakaan: ${report.statistics.accidents}</span>
                        <span class="badge bg-warning">Hampir Celaka: ${report.statistics.nearMisses}</span>
                    </div>
                </div>
            `;
        });
        
        recentReportsHtml += '</div>';
    }
    
    statsElement.innerHTML = statsHtml;
    recentReportsList.innerHTML = recentReportsHtml;
    
    // Reattach event listeners
    const newReportBtn = document.getElementById('btn-new-report');
    if (newReportBtn) {
        newReportBtn.addEventListener('click', function() {
            navigateTo('section-a');
        });
    }
};
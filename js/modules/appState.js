// js/modules/appState.js
export const P2K3AppState = {
    currentSection: 'dashboard',
    reportData: {
        company: null,
        statistics: {},
        activities: {},
        evaluation: {},
        closing: {}
    },
    savedReports: []
};

export const initializeAppState = () => {
    const savedReports = localStorage.getItem('p2k3-reports');
    P2K3AppState.savedReports = savedReports ? JSON.parse(savedReports) : [];
};
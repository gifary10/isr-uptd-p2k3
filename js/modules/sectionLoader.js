// js/modules/sectionLoader.js
import { initTableHandling } from './tableHandling.js';
import { initDashboard, updateDashboardStats } from '../components/sections/dashboard.js';

const sectionFiles = {
    'dashboard': 'dashboard.html',
    'section-a': 'section-a.html',
    'section-b': 'section-b.html',
    'section-c': 'section-c.html',
    'section-d': 'section-d.html',
    'section-e': 'section-e.html'
};

export const loadSectionContent = async (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;
    
    try {
        const response = await fetch(sectionFiles[sectionId]);
        if (!response.ok) throw new Error(`Failed to load ${sectionId}`);
        
        const content = await response.text();
        sectionElement.innerHTML = content;
        
        // Initialize event listeners after loading
        if (sectionId === 'dashboard') {
            initDashboard();
        }
    } catch (error) {
        console.error('Error loading section:', error);
        sectionElement.innerHTML = `<p>Error loading content: ${error.message}</p>`;
    }
};

export const loadAllSections = async () => {
    for (const sectionId of Object.keys(sectionFiles)) {
        await loadSectionContent(sectionId);
    }
};
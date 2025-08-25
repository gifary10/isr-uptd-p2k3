// signature-modal.js
import SignaturePad from 'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.min.js';

export const initSignatureModal = () => {
    const modalElement = document.getElementById('signatureModal');
    if (!modalElement) return;
    
    // Load modal content
    fetch('components/signature-modal.html')
        .then(response => response.text())
        .then(html => {
            modalElement.innerHTML = html;
            
            let signaturePad = null;
            let currentSignatureField = null;
            
            // Initialize signature pad when modal is shown
            modalElement.addEventListener('shown.bs.modal', function () {
                const canvas = document.getElementById('signature-pad');
                if (canvas) {
                    signaturePad = new SignaturePad(canvas, {
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                        penColor: 'rgb(0, 0, 0)',
                        minWidth: 1,
                        maxWidth: 3
                    });
                    
                    // Adjust canvas size for high DPI displays
                    const ratio = Math.max(window.devicePixelRatio || 1, 1);
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = canvas.offsetHeight * ratio;
                    canvas.getContext("2d").scale(ratio, ratio);
                    signaturePad.clear();
                }
            });
            
            // Clear signature button
            const clearBtn = document.getElementById('clear-signature');
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    if (signaturePad) {
                        signaturePad.clear();
                    }
                });
            }
            
            // Save signature button
            const saveBtn = document.getElementById('save-signature');
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    if (signaturePad && !signaturePad.isEmpty() && currentSignatureField) {
                        const signatureData = signaturePad.toDataURL();
                        currentSignatureField.value = signatureData;
                        
                        // Update the signature preview
                        const previewId = currentSignatureField.id + '-preview';
                        const previewElement = document.getElementById(previewId);
                        if (previewElement) {
                            previewElement.src = signatureData;
                            previewElement.style.display = 'block';
                        }
                        
                        // Hide the modal
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        if (modal) modal.hide();
                    } else if (signaturePad.isEmpty()) {
                        alert('Harap buat tanda tangan terlebih dahulu.');
                    }
                });
            }
            
            // Clean up when modal is hidden
            modalElement.addEventListener('hidden.bs.modal', function () {
                currentSignatureField = null;
            });
            
            // Function to open signature modal for a specific field
            window.openSignatureModal = function(fieldId) {
                currentSignatureField = document.getElementById(fieldId);
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            };
        })
        .catch(error => {
            console.error('Error loading signature modal:', error);
        });
};
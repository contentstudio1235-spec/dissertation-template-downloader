document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const preview = document.getElementById('preview');
    const pagesContainer = document.getElementById('pages-container');
    const downloadBtn = document.getElementById('download-pdf');

    // Default Data Structure
    let state = {
        studentName: 'Reet Kumari',
        guideName: 'Dr. ABHISHEK KUMAR',
        departmentName: 'Department of Physics',
        collegeName: "J.D. Women's College, Patna",
        universityName: 'Patliputra University, Patna',
        classRoll: '24',
        examRoll: '2520891050018',
        regNo: '1920523111050001',
        session: '2024--2026',
        projectTitle: 'ADVANCED QUANTUM MECHANICS',
        declarationText: '',
        ackText: '',
        bibText: '',
        design: {
            fontFamily: "'Libre Baskerville', serif",
            primaryColor: '#03045E',
            accentColor: '#FC4C4E',
            borderWidth: 1,
            borderColor: '#FFD700',
            lineSpacing: 2.2
        }
    };

    // 1. Tab Switching
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // 2. Rich Text Logic
    document.querySelectorAll('.toolbar button').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            document.execCommand(command, false, null);
            // Trigger sync after formatting
            const editorId = button.parentElement.dataset.editor;
            const editor = document.getElementById(editorId);
            editor.dispatchEvent(new Event('input'));
        });
    });

    // 3. Logo Upload Handling
    function handleLogoUpload(inputId, syncClass) {
        document.getElementById(inputId).addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.querySelectorAll('.' + syncClass).forEach(img => {
                        img.src = event.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    handleLogoUpload('upload-logo', 'sync-logo-main');
    handleLogoUpload('upload-icon', 'sync-logo-icon');

    // 4. Data Sync Logic
    function updatePreview() {
        // Sync text content
        document.querySelectorAll('.sync-student-name').forEach(el => el.textContent = state.studentName);
        document.querySelectorAll('.sync-guide-name').forEach(el => el.textContent = state.guideName);
        document.querySelectorAll('.sync-dept-name').forEach(el => el.textContent = state.departmentName);
        document.querySelectorAll('.sync-college-name').forEach(el => el.textContent = state.collegeName);
        document.querySelectorAll('.sync-uni-name').forEach(el => el.textContent = state.universityName);
        document.querySelectorAll('.sync-class-roll').forEach(el => el.textContent = state.classRoll);
        document.querySelectorAll('.sync-exam-roll').forEach(el => el.textContent = state.examRoll);
        document.querySelectorAll('.sync-reg-no').forEach(el => el.textContent = state.regNo);
        document.querySelectorAll('.sync-session').forEach(el => el.textContent = state.session);
        document.querySelectorAll('.sync-proj-title').forEach(el => el.textContent = state.projectTitle);
        
        // Update rich text areas
        document.querySelectorAll('.sync-decl-text').forEach(el => {
            el.innerHTML = state.declarationText;
        });
        document.querySelectorAll('.sync-ack-text').forEach(el => {
            el.innerHTML = state.ackText;
        });

        // Certification Logic (Semi-Static with Sync)
        document.querySelectorAll('.sync-cert-text').forEach(el => {
            el.innerHTML = `This is certifying that the dissertation entitled <strong>"${state.projectTitle}"</strong> is the recorded of the original work done by <strong>${state.studentName}</strong> M.SC SEM 4th under my supervision. The contents of the research presented in the dissertation have not previously formed the basis award of any degree, certificate of university.`;
        });

        document.querySelectorAll('.sync-bib-text').forEach(el => el.innerText = state.bibText);

        // Design Sync
        document.documentElement.style.setProperty('--primary-color', state.design.primaryColor);
        document.documentElement.style.setProperty('--accent-color', state.design.accentColor);
        document.documentElement.style.setProperty('--global-font', state.design.fontFamily);
        document.documentElement.style.setProperty('--border-color', state.design.borderColor);
        document.documentElement.style.setProperty('--line-spacing', state.design.lineSpacing);

        adjustScaling();
    }

    // Sync from Inputs
    document.querySelectorAll('[data-sync]').forEach(input => {
        const handler = (e) => {
            const key = input.id;
            const val = input.contentEditable === 'true' ? input.innerHTML : input.value;
            state[key] = val;
            updatePreview();
        };
        input.addEventListener('input', handler);
    });

    // Mobile Logic
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Auto-scaling for pages
    function adjustScaling() {
        const previewWidth = preview.clientWidth - 40;
        const pageWidth = 21 * 37.795;
        
        if (previewWidth < pageWidth) {
            const scale = previewWidth / pageWidth;
            document.querySelectorAll('.page').forEach(page => {
                page.style.transform = `scale(${scale})`;
                page.style.marginBottom = `${-(page.offsetHeight * (1 - scale))}px`;
            });
        } else {
            document.querySelectorAll('.page').forEach(page => {
                page.style.transform = 'scale(1)';
                page.style.marginBottom = '40px';
            });
        }
    }

    window.addEventListener('resize', adjustScaling);
    const resizeObserver = new ResizeObserver(adjustScaling);
    resizeObserver.observe(preview);

    // PDF Generation
    downloadBtn.addEventListener('click', () => {
        document.querySelectorAll('.page').forEach(page => {
            page.style.transform = 'none';
            page.style.marginBottom = '0';
        });

        const element = document.getElementById('pages-container');
        const opt = {
            margin:       0,
            filename:     'Dissertation_Matter.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            adjustScaling();
        });
    });

    // Load Initial Data
    async function loadDefaults() {
        state.declarationText = `I <strong>Reet Kumari</strong> here by declare that this dissertation entitled <strong>"ADVANCED QUANTUM MECHANICS"</strong> is outcome of my own study taken under the guidance of <strong>Dr. ABHISHEK KUMAR (HOD)</strong> Department of Physics, J.D. Women's College Patna. I have duly acknowledged all the source used by me in the preparation of the dissertation.`;
        state.ackText = `I would like to express my sincere and respectful gratitude to <strong>Dr. ABHISHEK KUMAR</strong>, Head of the Department of Physics, J.D. Women's College, for his invaluable guidance, constructive suggestions, and continuous encouragement throughout this project.<br><br>I am also deeply thankful to <strong>Patliputra University</strong> and <strong>J.D. Women's College, Patna</strong>, for providing the academic environment and institutional facilities necessary for the successful completion of this work.`;
        state.bibText = `[1] D. J. Griffiths, Introduction to Elementary Particles.\n[2] Halzen & Martin, Quarks and Leptons.\n[3] Peskin & Schroeder, Quantum Field Theory.`;

        // Fill inputs
        Object.keys(state).forEach(key => {
            const el = document.getElementById(key);
            if (el) {
                if (el.contentEditable === 'true') el.innerHTML = state[key];
                else el.value = state[key];
            }
        });
        
        updatePreview();
    }

    loadDefaults();
});

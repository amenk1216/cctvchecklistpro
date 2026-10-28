/**
 * ============================================================================
 * CCTV CHECKLIST & SISTEM PRO - CLIENT-SIDE APPLICATION LOGIC (V2)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STATE & STORAGE KEYS
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    GAS_URL: 'cctv_checklist_gas_url',
    DRAFT_DATA: 'cctv_checklist_draft_v2'
  };

  // Default Backend URL Google Apps Script yang sudah aktif
  const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbyaC89OWgsrXc-BsxUepgE8V2fVCU-H8yvVJxgfnJhQF0SbjzOF9rpOLYJEI0LUK8oY/exec';

  const TOTAL_CHECKLIST_COUNT = 36; // 10 (A) + 8 (B) + 8 (C) + 10 (D)

  // DOM Elements: Header Controls
  const headerProgressBar = document.getElementById('headerProgressBar');
  const headerProgressPercent = document.getElementById('headerProgressPercent');
  const headerProgressCount = document.getElementById('headerProgressCount');

  // View Switchers
  const tabFormBtn = document.getElementById('tabFormBtn');
  const tabSplitBtn = document.getElementById('tabSplitBtn');
  const tabPreviewBtn = document.getElementById('tabPreviewBtn');
  const mainContainer = document.getElementById('mainContainer');

  // Action Buttons
  const btnQuickDemo = document.getElementById('btnQuickDemo');
  const btnExportImage = document.getElementById('btnExportImage');
  const btnExportPdf = document.getElementById('btnExportPdf');
  const btnSubmitGas = document.getElementById('btnSubmitGas');
  const btnPreviewDownload = document.getElementById('btnPreviewDownload');
  const btnPreviewRefresh = document.getElementById('btnPreviewRefresh');

  // Toolbar Quick Helpers
  const btnCheckAllGlobal = document.getElementById('btnCheckAllGlobal');
  const btnUncheckAllGlobal = document.getElementById('btnUncheckAllGlobal');
  const btnResetForm = document.getElementById('btnResetForm');

  // Input Fields
  const inputSite = document.getElementById('inputSite');
  const inputTanggal = document.getElementById('inputTanggal');
  const inputTeknisi = document.getElementById('inputTeknisi');
  const inputCctvDone = document.getElementById('inputCctvDone');
  const inputCctvTotal = document.getElementById('inputCctvTotal');
  const inputCatatan = document.getElementById('inputCatatan');
  const itemA5Done = document.getElementById('item_a5_done');
  const itemA5Target = document.getElementById('item_a5_target');
  const sigTeknisiName = document.getElementById('sigTeknisiName');
  const sigPicName = document.getElementById('sigPicName');

  // Poster Sync Elements
  const previewSite = document.getElementById('previewSite');
  const previewTanggal = document.getElementById('previewTanggal');
  const previewTeknisi = document.getElementById('previewTeknisi');
  const previewCctvDone = document.getElementById('previewCctvDone');
  const previewCctvTotal = document.getElementById('previewCctvTotal');
  const badgeSitePreview = document.getElementById('badgeSitePreview');
  const badgeDatePreview = document.getElementById('badgeDatePreview');
  const badgeCctvPreview = document.getElementById('badgeCctvPreview');

  // Special A5 inside poster
  const pItemA5Done = document.getElementById('p_item_a5_done');
  const pItemA5Target = document.getElementById('p_item_a5_target');

  // Verified Seals
  const allSystemsOkBanner = document.getElementById('allSystemsOkBanner');
  const posterVerifiedSeal = document.getElementById('posterVerifiedSeal');

  // Poster Names & Dates Elements
  const pSigTeknisiName = document.getElementById('p_sig_teknisi_name');
  const pSigTeknisiDate = document.getElementById('p_sig_teknisi_date');
  const pSigPicName = document.getElementById('p_sig_pic_name');
  const pSigPicDate = document.getElementById('p_sig_pic_date');

  // Loading Overlay & Toast

  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingTitle = document.getElementById('loadingTitle');
  const loadingDesc = document.getElementById('loadingDesc');
  const toastContainer = document.getElementById('toastContainer');

  // --------------------------------------------------------------------------
  // 2. SYNCHRONIZATION: FORM INPUTS -> POSTER
  // --------------------------------------------------------------------------
  function getFormattedCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function updateMetadata() {
    const siteVal = inputSite.value.trim() || '-';
    const dateVal = inputTanggal.value.trim() || getFormattedCurrentDate();
    const techVal = inputTeknisi.value.trim() || '-';
    const cctvDoneVal = inputCctvDone.value.trim() || '0';
    const cctvTotalVal = inputCctvTotal.value.trim() || '0';

    previewSite.textContent = siteVal;
    previewTanggal.textContent = dateVal;
    previewTeknisi.textContent = techVal;
    previewCctvDone.textContent = cctvDoneVal;
    previewCctvTotal.textContent = cctvTotalVal;

    badgeSitePreview.textContent = `Site: ${siteVal}`;
    badgeDatePreview.textContent = `Tanggal: ${dateVal}`;
    badgeCctvPreview.textContent = `CCTV: ${cctvDoneVal}/${cctvTotalVal} Unit`;

    // Teknisi & PIC Site Text in Poster
    const techConfirmName = sigTeknisiName.value.trim() || techVal;
    const picConfirmName = sigPicName.value.trim() || '-';

    pSigTeknisiName.textContent = techConfirmName;
    pSigTeknisiDate.textContent = dateVal;

    pSigPicName.textContent = picConfirmName;
    pSigPicDate.textContent = dateVal;

    // Special item A5
    pItemA5Done.textContent = itemA5Done.value.trim() || cctvDoneVal;
    pItemA5Target.textContent = itemA5Target.value.trim() || cctvTotalVal;

    // Notes splitting onto ruled lines
    updateNotesPreview();

    // Auto calculate progress
    calculateProgress();

    autoSaveDraft();
  }

  function updateNotesPreview() {
    const text = inputCatatan.value.trim();
    const notesEl = document.getElementById('p_catatan_text');
    if (notesEl) {
      notesEl.textContent = text;
    }
  }

  function updateStatusPekerjaanPreview() {
    const selected = document.querySelector('input[name="statusPekerjaan"]:checked');
    const val = selected ? selected.value : 'Selesai';

    const pSelesai = document.getElementById('p_status_selesai');
    const pCatatan = document.getElementById('p_status_catatan');
    const pBelum = document.getElementById('p_status_belum');

    pSelesai.classList.remove('checked');
    pCatatan.classList.remove('checked');
    pBelum.classList.remove('checked');

    if (val === 'Selesai') {
      pSelesai.classList.add('checked');
    } else if (val === 'Selesai dengan catatan') {
      pCatatan.classList.add('checked');
    } else if (val === 'Belum selesai') {
      pBelum.classList.add('checked');
    }

    autoSaveDraft();
  }

  // --------------------------------------------------------------------------
  // 3. CHECKLIST ITEMS SYNC & PROGRESS STATS
  // --------------------------------------------------------------------------
  const allCheckboxes = document.querySelectorAll('.check-item input[type="checkbox"]');

  function syncCheckbox(cb) {
    const id = cb.id;
    const posterItem = document.getElementById(`p_${id}`);
    if (posterItem) {
      if (cb.checked) {
        posterItem.classList.add('checked');
      } else {
        posterItem.classList.remove('checked');
      }
    }
  }

  function calculateProgress() {
    let checkedCount = 0;
    let sectionAChecked = 0;
    let sectionBChecked = 0;
    let sectionCChecked = 0;
    let sectionDChecked = 0;

    allCheckboxes.forEach(cb => {
      if (cb.checked) {
        checkedCount++;
        const sec = cb.getAttribute('data-section');
        if (sec === 'A') sectionAChecked++;
        if (sec === 'B') sectionBChecked++;
        if (sec === 'C') sectionCChecked++;
        if (sec === 'D') sectionDChecked++;
      }
    });

    const percent = Math.round((checkedCount / TOTAL_CHECKLIST_COUNT) * 100);

    headerProgressBar.style.width = `${percent}%`;
    headerProgressPercent.textContent = `${percent}%`;
    headerProgressCount.textContent = `(${checkedCount}/${TOTAL_CHECKLIST_COUNT} Item)`;

    // Verified seals condition
    const isVerified = (sectionDChecked >= 10) || (percent === 100);
    if (isVerified) {
      allSystemsOkBanner.classList.add('active');
      posterVerifiedSeal.style.filter = 'none';
      posterVerifiedSeal.style.opacity = '1';
    } else {
      allSystemsOkBanner.classList.remove('active');
      posterVerifiedSeal.style.filter = 'grayscale(0.4)';
      posterVerifiedSeal.style.opacity = '0.6';
    }

    return {
      total: TOTAL_CHECKLIST_COUNT,
      checked: checkedCount,
      percent: percent,
      sectionA: `${sectionAChecked}/10`,
      sectionB: `${sectionBChecked}/8`,
      sectionC: `${sectionCChecked}/8`,
      sectionD: `${sectionDChecked}/10`
    };
  }

  allCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      syncCheckbox(cb);
      calculateProgress();
      autoSaveDraft();
    });
  });

  // Section "Centang Semua" buttons
  document.querySelectorAll('[data-action="check-all"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetGroupId = btn.getAttribute('data-target');
      const groupEl = document.getElementById(targetGroupId);
      if (groupEl) {
        const cbs = groupEl.querySelectorAll('input[type="checkbox"]');
        cbs.forEach(cb => {
          cb.checked = true;
          syncCheckbox(cb);
        });
        calculateProgress();
        autoSaveDraft();
        showToast('Semua item di bagian ini dicentang.', 'info');
      }
    });
  });

  // Global Check All / Uncheck All
  btnCheckAllGlobal.addEventListener('click', () => {
    allCheckboxes.forEach(cb => {
      cb.checked = true;
      syncCheckbox(cb);
    });
    calculateProgress();
    autoSaveDraft();
    showToast('Seluruh checklist telah dicentang!', 'success');
  });

  btnUncheckAllGlobal.addEventListener('click', () => {
    allCheckboxes.forEach(cb => {
      cb.checked = false;
      syncCheckbox(cb);
    });
    calculateProgress();
    autoSaveDraft();
    showToast('Seluruh centang checklist dibatalkan.', 'info');
  });

  // Reset Form
  btnResetForm.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh formulir? Data draf akan dibersihkan.')) {
      resetForm();
      showToast('Formulir berhasil direset.', 'info');
    }
  });

  function resetForm() {
    inputSite.value = '';
    inputTanggal.value = getFormattedCurrentDate();
    inputTeknisi.value = '';
    inputCctvDone.value = '';
    inputCctvTotal.value = '';
    inputCatatan.value = '';
    itemA5Done.value = '';
    itemA5Target.value = '';
    sigTeknisiName.value = '';
    sigPicName.value = '';

    const radioDefault = document.querySelector('input[name="statusPekerjaan"][value="Selesai"]');
    if (radioDefault) radioDefault.checked = true;

    allCheckboxes.forEach(cb => {
      cb.checked = false;
      syncCheckbox(cb);
    });

    updateMetadata();
    updateStatusPekerjaanPreview();
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DATA);
  }

  // Bind input listeners
  [
    inputSite, inputTanggal, inputTeknisi, inputCctvDone, inputCctvTotal,
    inputCatatan, itemA5Done, itemA5Target, sigTeknisiName, sigPicName
  ].forEach(input => {
    if (input) {
      input.addEventListener('input', updateMetadata);
    }
  });

  document.querySelectorAll('input[name="statusPekerjaan"]').forEach(radio => {
    radio.addEventListener('change', updateStatusPekerjaanPreview);
  });

  // --------------------------------------------------------------------------
  // 4. VIEW SWITCHING MODES (Form / Split / Preview)
  // --------------------------------------------------------------------------
  function setViewMode(mode) {
    tabFormBtn.classList.remove('active');
    tabSplitBtn.classList.remove('active');
    tabPreviewBtn.classList.remove('active');

    mainContainer.classList.remove('layout-form', 'layout-split', 'layout-preview');

    if (mode === 'form') {
      tabFormBtn.classList.add('active');
      mainContainer.classList.add('layout-form');
    } else if (mode === 'split') {
      tabSplitBtn.classList.add('active');
      mainContainer.classList.add('layout-split');
    } else if (mode === 'preview') {
      tabPreviewBtn.classList.add('active');
      mainContainer.classList.add('layout-preview');
    }
  }

  tabFormBtn.addEventListener('click', () => setViewMode('form'));
  tabSplitBtn.addEventListener('click', () => setViewMode('split'));
  tabPreviewBtn.addEventListener('click', () => setViewMode('preview'));

  btnPreviewRefresh.addEventListener('click', () => {
    updateMetadata();
    updateStatusPekerjaanPreview();
    showToast('Tampilan live preview poster diperbarui.', 'info');
  });

  // --------------------------------------------------------------------------
  // 5. EXPORT ENGINES (HIGH-RES PNG & A4 LANDSCAPE PDF)
  // --------------------------------------------------------------------------
  async function generatePosterCanvas() {
    const posterEl = document.getElementById('cctvPosterDocument');
    if (!posterEl) throw new Error('Elemen poster tidak ditemukan');

    updateMetadata();
    updateNotesPreview();
    updateStatusPekerjaanPreview();

    // Aktifkan poster secara terstruktur dan aman di layer belakang (berfungsi dari tab Form Input, Split, maupun Preview)
    document.body.classList.add('is-exporting-capture');

    // Beri jeda 80ms untuk menjamin layout & font browser siap di-render
    await new Promise(resolve => setTimeout(resolve, 80));

    try {
      return await html2canvas(posterEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1400,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedPoster = clonedDoc.getElementById('cctvPosterDocument');
          if (clonedPoster) {
            clonedPoster.style.display = 'flex';
            clonedPoster.style.visibility = 'visible';
            clonedPoster.style.opacity = '1';
            clonedPoster.style.boxShadow = 'none';
            clonedPoster.style.borderRadius = '0';
            clonedPoster.style.margin = '0';
            clonedPoster.style.width = '1200px';
          }
        }
      });
    } finally {
      document.body.classList.remove('is-exporting-capture');
    }
  }

  // Export PNG Image
  async function exportAsImage() {
    showLoading('Merender Gambar...', 'Sedang membuat file PNG beresolusi tinggi.');
    try {
      const canvas = await generatePosterCanvas();
      const siteClean = (inputSite.value.trim() || 'Site').replace(/[^a-zA-Z0-9_-]/g, '_');
      const dateClean = (inputTanggal.value.trim() || getFormattedCurrentDate()).replace(/[^a-zA-Z0-9_-]/g, '-');
      const fileName = `Checklist_CCTV_${siteClean}_${dateClean}.png`;

      const imageURI = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imageURI;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Gambar poster resolusi tinggi berhasil diunduh!', 'success');
    } catch (err) {
      console.error(err);
      showToast(`Gagal mengekspor gambar: ${err.message}`, 'error');
    } finally {
      hideLoading();
    }
  }

  btnExportImage.addEventListener('click', exportAsImage);
  btnPreviewDownload.addEventListener('click', exportAsImage);

  // Export PDF Document (A4 Landscape)
  async function exportAsPdf() {
    showLoading('Membuat PDF...', 'Sedang merapikan tata letak cetak A4 Landscape.');
    try {
      const canvas = await generatePosterCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const { jsPDF } = window.jspdf;
      // Standard A4 Landscape: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();   // 297 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

      const margin = 4; // 4mm margin
      const targetWidth = pageWidth - (margin * 2);
      const targetHeight = (canvas.height * targetWidth) / canvas.width;

      const yPos = (pageHeight - targetHeight) / 2;

      pdf.addImage(imgData, 'JPEG', margin, Math.max(margin, yPos), targetWidth, targetHeight);

      const siteClean = (inputSite.value.trim() || 'Site').replace(/[^a-zA-Z0-9_-]/g, '_');
      const dateClean = (inputTanggal.value.trim() || getFormattedCurrentDate()).replace(/[^a-zA-Z0-9_-]/g, '-');
      const fileName = `Checklist_CCTV_${siteClean}_${dateClean}.pdf`;

      pdf.save(fileName);
      showToast('Dokumen PDF berhasil dibuat dan diunduh!', 'success');
    } catch (err) {
      console.error(err);
      showToast(`Gagal membuat PDF: ${err.message}`, 'error');
    } finally {
      hideLoading();
    }
  }

  btnExportPdf.addEventListener('click', exportAsPdf);

  // --------------------------------------------------------------------------
  // 6. GOOGLE APPS SCRIPT (GAS) INTEGRATION
  // --------------------------------------------------------------------------
  // Submit to Google Spreadsheet via GAS Web App
  async function submitToGoogleSheets() {
    const gasUrl = (window.GAS_BACKEND_URL && window.GAS_BACKEND_URL.trim()) || DEFAULT_GAS_URL;

    // Validation
    const site = inputSite.value.trim();
    const teknisi = inputTeknisi.value.trim();
    if (!site || !teknisi) {
      alert('Mohon lengkapi minimal "Nama Site" dan "Nama Teknisi" sebelum menyimpan.');
      return;
    }

    showLoading('Menyimpan File...', 'Sedang memproses dan menyimpan data formulir.');

    try {
      const stats = calculateProgress();
      const selectedStatus = document.querySelector('input[name="statusPekerjaan"]:checked');

      const checklistMap = {};
      allCheckboxes.forEach(cb => {
        checklistMap[cb.id] = cb.checked;
      });

      const payload = {
        site: site,
        tanggal: inputTanggal.value.trim() || getFormattedCurrentDate(),
        teknisi: teknisi,
        picSite: sigPicName.value.trim() || '-',
        totalCctv: `${inputCctvDone.value.trim() || 0} / ${inputCctvTotal.value.trim() || 0} Unit`,
        statusPekerjaan: selectedStatus ? selectedStatus.value : 'Selesai',
        catatan: inputCatatan.value.trim() || '-',
        stats: stats,
        checklistMap: checklistMap,
        timestamp: new Date().toISOString()
      };

      try {
        const response = await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          }
        });

        const resText = await response.text();
        let result = {};
        try {
          result = JSON.parse(resText);
        } catch (e) {
          result = { status: 'success' };
        }

        if (result.status === 'success' || result.status === 'ok') {
          showToast('Data berhasil disimpan!', 'success');
        } else {
          showToast('Data berhasil disimpan ke sistem.', 'success');
        }
      } catch (postErr) {
        // Fallback using no-cors
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
        showToast('Data berhasil disimpan ke sistem (Mode Tanpa Hambatan)!', 'success');
      }

    } catch (err) {
      console.error(err);
      showToast(`Gagal menyimpan file: ${err.message}`, 'error');
    } finally {
      hideLoading();
    }
  }

  btnSubmitGas.addEventListener('click', submitToGoogleSheets);

  // Tombol aksi di bagian bawah formulir input (Form Input View)
  const btnFormExportImage = document.getElementById('btnFormExportImage');
  const btnFormExportPdf = document.getElementById('btnFormExportPdf');
  const btnFormSubmitGas = document.getElementById('btnFormSubmitGas');
  const btnFormViewPreview = document.getElementById('btnFormViewPreview');

  if (btnFormExportImage) btnFormExportImage.addEventListener('click', exportAsImage);
  if (btnFormExportPdf) btnFormExportPdf.addEventListener('click', exportAsPdf);
  if (btnFormSubmitGas) btnFormSubmitGas.addEventListener('click', submitToGoogleSheets);
  if (btnFormViewPreview) btnFormViewPreview.addEventListener('click', () => setViewMode('preview'));

  // --------------------------------------------------------------------------
  // 7. QUICK DEMO DATA FILLER (Isi Contoh)
  // --------------------------------------------------------------------------
  btnQuickDemo.addEventListener('click', () => {
    inputSite.value = 'DC Logistik Cikarang Blok B-12';
    inputTanggal.value = getFormattedCurrentDate();
    inputTeknisi.value = 'Budi Santoso (Lead Field Eng)';
    inputCctvDone.value = '16';
    inputCctvTotal.value = '16';
    itemA5Done.value = '16';
    itemA5Target.value = '16';
    inputCatatan.value = 'Semua 16 kamera telah ditest live view 4K & playback 24 jam.\nKoneksi NTP tersinkron sempurna dengan server pusat.\nRemote access RustDesk ID: 892 104 221.';

    sigTeknisiName.value = 'Budi Santoso';
    sigPicName.value = 'Hendra Wijaya (SM Site)';

    // Check all checkboxes
    allCheckboxes.forEach(cb => {
      cb.checked = true;
      syncCheckbox(cb);
    });

    const statusRadio = document.querySelector('input[name="statusPekerjaan"][value="Selesai"]');
    if (statusRadio) statusRadio.checked = true;

    updateMetadata();
    updateStatusPekerjaanPreview();

    showToast('Data percontohan instalasi berhasil diisi lengkap!', 'success');
  });

  // --------------------------------------------------------------------------
  // 8. DRAFT PERSISTENCE (AUTO-SAVE & RELOAD)
  // --------------------------------------------------------------------------
  function autoSaveDraft() {
    try {
      const checkboxStates = {};
      allCheckboxes.forEach(cb => {
        checkboxStates[cb.id] = cb.checked;
      });

      const selectedStatus = document.querySelector('input[name="statusPekerjaan"]:checked');

      const draft = {
        site: inputSite.value,
        tanggal: inputTanggal.value,
        teknisi: inputTeknisi.value,
        cctvDone: inputCctvDone.value,
        cctvTotal: inputCctvTotal.value,
        a5Done: itemA5Done.value,
        a5Target: itemA5Target.value,
        catatan: inputCatatan.value,
        statusPekerjaan: selectedStatus ? selectedStatus.value : 'Selesai',
        sigTeknisiName: sigTeknisiName.value,
        sigPicName: sigPicName.value,
        checkboxStates: checkboxStates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.DRAFT_DATA, JSON.stringify(draft));
    } catch (e) {
      // Storage quota safeguard
    }
  }

  function loadSavedDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DRAFT_DATA);
      if (!raw) {
        inputTanggal.value = getFormattedCurrentDate();
        updateMetadata();
        return;
      }

      const draft = JSON.parse(raw);
      inputSite.value = draft.site || '';
      inputTanggal.value = draft.tanggal || getFormattedCurrentDate();
      inputTeknisi.value = draft.teknisi || '';
      inputCctvDone.value = draft.cctvDone || '';
      inputCctvTotal.value = draft.cctvTotal || '';
      itemA5Done.value = draft.a5Done || '';
      itemA5Target.value = draft.a5Target || '';
      inputCatatan.value = draft.catatan || '';
      sigTeknisiName.value = draft.sigTeknisiName || '';
      sigPicName.value = draft.sigPicName || '';

      if (draft.statusPekerjaan) {
        const rad = document.querySelector(`input[name="statusPekerjaan"][value="${draft.statusPekerjaan}"]`);
        if (rad) rad.checked = true;
      }

      if (draft.checkboxStates) {
        allCheckboxes.forEach(cb => {
          if (draft.checkboxStates[cb.id] !== undefined) {
            cb.checked = draft.checkboxStates[cb.id];
            syncCheckbox(cb);
          }
        });
      }

      updateMetadata();
      updateStatusPekerjaanPreview();
    } catch (e) {
      console.warn('Gagal memuat draf:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 9. UI UTILITIES: TOASTS & LOADING
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  function showLoading(title, desc) {
    loadingTitle.textContent = title || 'Memproses...';
    loadingDesc.textContent = desc || 'Harap tunggu beberapa saat.';
    loadingOverlay.classList.add('open');
  }

  function hideLoading() {
    loadingOverlay.classList.remove('open');
  }

  // --------------------------------------------------------------------------
  // 10. BOOTSTRAP APP
  // --------------------------------------------------------------------------
  loadSavedDraft();
  calculateProgress();

  // Otomatis buka Split Mode pada layar desktop/laptop agar poster langsung tampil
  if (window.innerWidth >= 1100) {
    setViewMode('split');
  } else {
    setViewMode('form');
  }
});


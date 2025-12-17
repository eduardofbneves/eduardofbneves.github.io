
// Initialize a Tableau viz using the v1 API and wire up export buttons
(function() {
  const container = document.getElementById('vizContainer');
  if (!container) return;

  const url = container.dataset.url || '';
  if (!url) {
    console.warn('No Tableau URL provided. Set data-url on #vizContainer.');
    return;
  }

  function initViz() {
    const options = {
      hideTabs: (container.dataset.tabs || 'no') === 'no',
      hideToolbar: (container.dataset.toolbar || 'yes') === 'no',
      onFirstInteractive: function() {
        console.log('Tableau viz ready');
        wireExports();
      }
    };

    // Compute responsive size
    const w = container.clientWidth;
    const h = Math.max(Math.round(w * 0.62), 480);
    container.style.height = h + 'px';

    window.viz = new tableau.Viz(container, url, options);
  }

  function wireExports() {
    const pdfBtn = document.getElementById('exportPDF');
    const imgBtn = document.getElementById('exportImage');
    if (pdfBtn) pdfBtn.addEventListener('click', () => window.viz && window.viz.showExportPDFDialog());
    if (imgBtn) imgBtn.addEventListener('click', () => window.viz && window.viz.showExportImageDialog());
  }

  // Recompute size on resize
  window.addEventListener('resize', () => {
    if (!window.viz) return;
    const w = container.clientWidth;
    const h = Math.max(Math.round(w * 0.62), 480);
    container.style.height = h + 'px';
    try { window.viz.setFrameSize(w, h); } catch(e) {}
  });

  initViz();
})();

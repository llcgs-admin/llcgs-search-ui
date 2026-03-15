export function openPdfForRecord(rec) {
    if (!rec || !rec.file_id) return;

    const multi = document.getElementById("multiPopupToggle")?.checked;
    const usePreview = document.getElementById("usePreviewToggle")?.checked;

    let url, target;

    if (usePreview) {
        url = `https://drive.google.com/file/d/${rec.file_id}/preview`;
        target = multi ? "_blank" : "pdfPopup";
        window.open(url, target, "width=900,height=1100");
    } else {
        url = `https://drive.google.com/file/d/${rec.file_id}/view`;
        target = multi ? "_blank" : "pdfTab";
        window.open(url, target);
    }
}

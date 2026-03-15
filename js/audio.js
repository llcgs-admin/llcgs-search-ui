export function toggleAudio(target, findRecordById) {
    const id = target.dataset.id;
    const rec = findRecordById(id);
    if (!rec || !rec.audioId) return;

    const resultEl = target.closest(".result");
    const container = resultEl.querySelector(".audio-container");
    const iframe = container.querySelector("iframe");
    const isOpen = container.classList.contains("open");

    if (isOpen) {
        container.classList.remove("open");
        iframe.src = "";
        target.querySelector(".audio-label").textContent = "Play Audio";
        target.classList.remove("open");
        return;
    }

    const previewUrl = `https://drive.google.com/file/d/${rec.audioId}/preview`;

    iframe.src = previewUrl;
    container.classList.add("open");
    target.querySelector(".audio-label").textContent = "Close Audio";
    target.classList.add("open");
}


/*
let canvas, ctx, image ,selectedText = null;

document.addEventListener("DOMContentLoaded", () => {

    canvas = document.getElementById("memeCanvas");
    ctx = canvas.getContext("2d");

    // رفع الصورة
    document.getElementById("imageUpload")
        .addEventListener("change", handleImageUpload);
//زر نسخ الرابط و Share Modal
document.getElementById("shareBtn").addEventListener("click", () => {
    const shareModal = new bootstrap.Modal(document.getElementById("shareModal"));
    shareModal.show();
});
/////زر إضافة النصوص
document.getElementById("addTextBtn").addEventListener("click", () => {
    const textInput = document.getElementById("textInput");
    const textValue = textInput.value.trim();
    if (!textValue) return;

    const textDiv = document.createElement("div");
    textDiv.className = "draggable-text";
    textDiv.contentEditable = true;
    textDiv.innerText = textValue;

    // ضع النص في منتصف الكانفاس
    const canvasRect = canvas.getBoundingClientRect();
    textDiv.style.left = canvasRect.width / 2 + "px";
    textDiv.style.top = canvasRect.height / 2 + "px";

    document.getElementById("textsLayer").appendChild(textDiv);

    makeTextDraggable(textDiv); // لجعل النص قابل للسحب
});

// Delete Selected Text

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("draggable-text")) {
        selectedText = e.target;
        e.target.style.outline = "2px dashed yellow";
    } else if (selectedText) {
        selectedText.style.outline = "none";
        selectedText = null;
    }
});

document.getElementById("deleteTextBtn").addEventListener("click", () => {
    if (selectedText) {
        selectedText.remove();
        selectedText = null;
    }
});




    // ============================
    // COPY LINK BUTTON
    // ============================
    document.getElementById("copyLinkBtn").addEventListener("click", async () => {
        const imageUrl = await uploadMemeToServer();
        if (!imageUrl) return;

        try {
            await navigator.clipboard.writeText(imageUrl);
            showNotification("تم نسخ رابط الصورة!");
        } catch {
            alert("فشل نسخ الرابط");
        }
    });

    // ============================
    // SHARE
    // ============================
    window.shareOn = async function (platform) {
        const imageUrl = await uploadMemeToServer();
        if (!imageUrl) return;

        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
                break;

            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my meme!")}&url=${encodeURIComponent(imageUrl)}`;
                break;

            case "pinterest":
                shareUrl = `https://pinterest.com/pin/create/button/?media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent("Check out my meme!")}`;
                break;
        }

        window.open(shareUrl, "_blank");
    };
});

// ============================
// FUNCTIONS
// ============================

// رفع الميم للسيرفر
async function uploadMemeToServer() {
    if (!image) {
        alert("ارفع صورة أولاً");
        return null;
    }

    // ارسم الصورة
    drawImageToCanvas();

    // ارسم النصوص مؤقتًا
    drawTextsOnCanvasTemporarily();

    const imageData = canvas.toDataURL("image/png");

    // رجّع الكانفاس نظيف
    drawImageToCanvas();

    try {
        const response = await fetch("/memes/save/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageData })
        });

        const data = await response.json();

        if (data.status === "success") {
            return window.location.origin + data.file;
        } else {
            alert("فشل حفظ الصورة");
            return null;
        }
    } catch (error) {
        alert("خطأ اتصال بالسيرفر");
        return null;
    }
}

// تحميل الصورة الأساسية
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            image = img;
            drawImageToCanvas();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// رسم الصورة فقط
function drawImageToCanvas() {
    if (!image) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// رسم النصوص من عناصر draggable
function drawTextsOnCanvasTemporarily() {
    const texts = document.querySelectorAll(".draggable-text");

    texts.forEach(t => {
        const rect = t.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const x = rect.left - canvasRect.left + t.offsetWidth / 2;
        const y = rect.top - canvasRect.top + t.offsetHeight / 2;

        const style = window.getComputedStyle(t);
        const fontSize = parseInt(style.fontSize);
        const color = style.color;
        const strokeColor = style.webkitTextStrokeColor || "black";
        const strokeWidth = parseFloat(style.webkitTextStrokeWidth) || 0;

        ctx.font = `${fontSize}px Impact, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (strokeWidth > 0) {
            ctx.lineWidth = strokeWidth * 2;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(t.textContent, x, y);
        }

        ctx.fillStyle = color;
        ctx.fillText(t.textContent, x, y);
    });


}

//جعل النصوص draggable
function makeTextDraggable(el) {
    let isDragging = false, startX, startY;

    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - el.offsetLeft;
        startY = e.clientY - el.offsetTop;
        el.style.zIndex = 1000; // النص فوق كل العناصر
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        el.style.left = e.clientX - startX + "px";
        el.style.top = e.clientY - startY + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        el.style.zIndex = "";
    });
}


// إشعار صغير
function showNotification(text) {
    const notification = document.getElementById("notification");
    notification.textContent = text;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
} */


/*/////كود الرسم////////////////////////
let drawing = false;
let brushColor = document.getElementById("brushColor").value;
let brushSize = parseInt(document.getElementById("brushSize").value);

document.getElementById("enableDrawBtn").addEventListener("click", () => {
    drawing = true;
    document.getElementById("enableDrawBtn").disabled = true;
    document.getElementById("disableDrawBtn").disabled = false;
});

document.getElementById("disableDrawBtn").addEventListener("click", () => {
    drawing = false;
    document.getElementById("enableDrawBtn").disabled = false;
    document.getElementById("disableDrawBtn").disabled = true;
});

canvas.addEventListener("mousedown", () => { if (drawing) drawing = true; });
canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = brushColor;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

document.getElementById("brushColor").addEventListener("input", (e) => brushColor = e.target.value);
document.getElementById("brushSize").addEventListener("input", (e) => brushSize = parseInt(e.target.value));
document.getElementById("clearDrawingBtn").addEventListener("click", () => drawImageToCanvas());

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////
alert("الوونننوووو");
let canvas, ctx, image = null;
let selectedText = null;   // ← النص المحدد حالياً

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("memeCanvas");
  ctx = canvas.getContext("2d");

  document.getElementById("imageUpload")
          .addEventListener("change", handleImageUpload);
          
});
//زر نسخ الرابط و Share Modal
document.getElementById("shareBtn").addEventListener("click", () => {
    const shareModal = new bootstrap.Modal(document.getElementById("shareModal"));
    shareModal.show();
});

//COPY LINK BUTTON
    // ============================
    document.getElementById("copyLinkBtn").addEventListener("click", async () => {
        const imageUrl = await uploadMemeToServer();
        if (!imageUrl) return;

        try {
            await navigator.clipboard.writeText(imageUrl);
            showNotification("تم نسخ رابط الصورة!");
        } catch {
            alert("فشل نسخ الرابط");
        }
});

// زر استخدام صورة نموذجية
const sampleImageBtn = document.getElementById("sampleImageBtn");
const sampleImagesModal = new bootstrap.Modal(document.getElementById("sampleImagesModal"));

// عند الضغط على الزر، افتح الـModal
sampleImageBtn.addEventListener("click", () => {
    sampleImagesModal.show();
});

// اختر صورة من الـModal
document.querySelectorAll(".sample-img").forEach(imgEl => {
    imgEl.addEventListener("click", () => {
        const img = new Image();
        img.src = imgEl.src; // أخذ src من الصورة اللي ضغطت عليها
        img.onload = () => {
            image = img;
            drawImageToCanvas();
            const emptyState = document.getElementById("emptyState");
            if (emptyState) emptyState.style.display = "none";

            // أغلق الـModal بعد الاختيار
            sampleImagesModal.hide();
        };
    });
});




//============================
//  CLEAR ALL
// ============================
const clearAllBtn = document.getElementById("clearAllBtn");
const emptyState = document.getElementById("emptyState");
const imageUpload = document.getElementById("imageUpload");

clearAllBtn.addEventListener("click", () => {
  // 1. مسح الـ canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. حذف كل النصوص
  document.querySelectorAll(".draggable-text")
          .forEach(el => el.remove());

  // 3. إعادة القيم
  selectedText = null;
  image = null;

  // 4. إظهار حالة البداية
  if (emptyState) emptyState.style.display = "block";

  // 5. تفريغ input الصورة
  if (imageUpload) imageUpload.value = "";
});

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      image = img;
      drawImageToCanvas();

      const emptyState = document.getElementById("emptyState");
      if (emptyState) emptyState.style.display = "none";
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}
// إشعار صغير
function showNotification(text) {
    const notification = document.getElementById("notification");
    notification.textContent = text;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
} 


function drawImageToCanvas() {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasAspect = canvas.width / canvas.height;
  const imageAspect = image.width / image.height;

  let w, h, x, y;

  if (imageAspect > canvasAspect) {
    w = canvas.width;
    h = canvas.width / imageAspect;
    x = 0;
    y = (canvas.height - h) / 2;
  } else {
    h = canvas.height;
    w = canvas.height * imageAspect;
    x = (canvas.width - w) / 2;
    y = 0;
  }

  ctx.drawImage(image, x, y, w, h);
}


//========================
//  TEXT LAYER & ADDING TEXT
// ============================
const textInput = document.getElementById("textInput");
const addTextBtn = document.getElementById("addTextBtn");
const textsLayer = document.getElementById("textsLayer");
const canvasContainer = document.getElementById("canvasContainer");

addTextBtn.addEventListener("click", () => {

    // ✅ تحقق إذا لم يتم رفع صورة
    if (!image) {
        alert("يرجى رفع صورة أولاً قبل إضافة النص!");
        return;
    }

    const textValue = textInput.value.trim();
    if (!textValue) return;

    // إذا كان هناك نص محدد، حدث محتواه فقط
    if (selectedText) {
        selectedText.textContent = textValue;
        applyTextStylesTo(selectedText);
    } else {
        // إنشاء نص جديد
        const div = document.createElement("div");
        div.classList.add("draggable-text");
        div.textContent = textValue;

        div.style.position = "absolute";
        div.style.left = "50%";
        div.style.top = "50%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.cursor = "move";

        textsLayer.appendChild(div);

        applyTextStylesTo(div);
        enableDrag(div);

        // عند الضغط على النص لتعديله
        div.addEventListener("click", (e) => {
            e.stopPropagation();

            // إزالة التحديد عن بقية النصوص
            document.querySelectorAll(".draggable-text")
                    .forEach(el => el.style.outline = "none");

            selectedText = div;
            div.style.outline = "2px dashed red";

            // عرض النص في الـ input لتعديله
            textInput.value = div.textContent;
        });
    }

    // مسح الحقل بعد الإضافة أو التعديل
    textInput.value = "";
});

// عند النقر في أي مكان على الصورة أو الـ canvasContainer، يتم إلغاء التحديد
canvasContainer.addEventListener("click", () => {
    document.querySelectorAll(".draggable-text")
            .forEach(el => el.style.outline = "none");
    selectedText = null;
    textInput.value = ""; // إفراغ حقل النص لإضافة نص جديد
});





// ============================
//  DRAGGING TEXT
// ============================
function enableDrag(el) {
    let isDragging = false, offsetX = 0, offsetY = 0;

    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const rect = canvasContainer.getBoundingClientRect();
        el.style.left = (e.clientX - rect.left - offsetX) + "px";
        el.style.top  = (e.clientY - rect.top - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => isDragging = false);
}


// ============================
//  TEXT STYLE CONTROLS
// ============================
const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");

const textColor = document.getElementById("textColor");
const strokeColor = document.getElementById("strokeColor");

const strokeWidth = document.getElementById("strokeWidth");
const strokeWidthValue = document.getElementById("strokeWidthValue");


function applyTextStylesTo(el) {
    el.style.fontSize = fontSize.value + "px";
    fontSizeValue.textContent = fontSize.value + "px";
    el.style.color = textColor.value;
    el.style.webkitTextStrokeColor = strokeColor.value;
    el.style.webkitTextStrokeWidth = strokeWidth.value + "px";
    strokeWidthValue.textContent = strokeWidth.value + "px";
}

// عند تغيير القيم تطبق فقط على النص المحدد
function applyTextStyles() {
    if (!selectedText) return;
    applyTextStylesTo(selectedText);
}

fontSize.addEventListener("input", applyTextStyles);
textColor.addEventListener("input", applyTextStyles);
strokeColor.addEventListener("input", applyTextStyles);
strokeWidth.addEventListener("input", applyTextStyles);


// ============================
//  DELETE SELECTED TEXT
// ============================
const deleteTextBtn = document.getElementById("deleteTextBtn");

deleteTextBtn.addEventListener("click", () => {
  if (selectedText) {
    selectedText.remove();
    selectedText = null;
    textInput.value = "";
  }
});
// ====================
// SAVE & UPLOAD
// ====================
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", saveMeme);

function saveMeme() {
  // إعادة رسم الصورة أولاً
  drawImageToCanvas();

  // رسم النصوص على الـ canvas مؤقتًا
  drawTextsOnCanvasTemporarily();
//تحميل الصورة
  const link = document.createElement("a");
      if (!image) {
        alert("ارفع صورة أولاً");
        return null;
    }
  link.download = "meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

   drawImageToCanvas();

}


// رسم النصوص من عناصر draggable
function drawTextsOnCanvasTemporarily() {
    const texts = document.querySelectorAll(".draggable-text");

    texts.forEach(t => {
        const rect = t.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        // تحويل الاحداثيات بناء على Canvas الفعلي
        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const x = (rect.left - canvasRect.left + t.offsetWidth / 2) * scaleX;
        const y = (rect.top - canvasRect.top + t.offsetHeight / 2) * scaleY;

        const style = window.getComputedStyle(t);
        const fontSize   = parseInt(style.fontSize) * scaleY; // scale حسب ارتفاع canvas
        const color      = style.color;
        const strokeColor = style.webkitTextStrokeColor || "black";
        const strokeWidthCSS = parseFloat(style.webkitTextStrokeWidth) || 0;
        const strokeWidth = strokeWidthCSS * scaleY; // scale للسماكة

        ctx.save();
        ctx.font = `${fontSize}px Impact, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (strokeWidth > 0) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(t.textContent, x, y);
        }

        ctx.fillStyle = color;
        ctx.fillText(t.textContent, x, y);

        ctx.restore();
    });
}


// رفع الميم للسيرفر
async function uploadMemeToServer() {
    if (!image) {
        alert("ارفع صورة أولاً");
        return null;
    }

    // ارسم الصورة
    drawImageToCanvas();

    // ارسم النصوص مؤقتًا
    drawTextsOnCanvasTemporarily();

    const imageData = canvas.toDataURL("image/png");

    // رجّع الكانفاس نظيف
    drawImageToCanvas();

    try {
        const response = await fetch("/memes/save/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageData })
        });

        const data = await response.json();

        if (data.status === "success") {
            return window.location.origin + data.file;
        } else {
            alert("فشل حفظ الصورة");
            return null;
        }
    } catch (error) {
        alert("خطأ اتصال بالسيرفر");
        return null;
    }
}



// SHARE
// ============================
window.shareOn = async function (platform) {
const imageUrl = await uploadMemeToServer();
        if (!imageUrl) return;

        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
                break;

            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my meme!")}&url=${encodeURIComponent(imageUrl)}`;
                break;

            case "pinterest":
                shareUrl = `https://pinterest.com/pin/create/button/?media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent("Check out my meme!")}`;
                break;
        }

        window.open(shareUrl, "_blank");
}; 

//الذهاب إلى الأعلى والأسفل بسلاسة

    const aboutBtn = document.getElementById("aboutBtn");
    const homeBtn  = document.getElementById("homeBtn");

    if (aboutBtn ) {
        aboutBtn.addEventListener("click", function (e) {
            e.preventDefault();//هذا السطر يمنع التصرف الافتراضي للعنصر
            e.stopPropagation();//هذا السطر يوقف انتشار الحدث
            footer.scrollIntoView({ behavior: "smooth" });
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
let canvas, ctx, image = null;
let selectedText = null;

// ============================
//  DOM READY
// ============================
document.addEventListener("DOMContentLoaded", () => {

    canvas = document.getElementById("memeCanvas");
    ctx = canvas.getContext("2d");

    document.getElementById("imageUpload")?.addEventListener("change", handleImageUpload);
    document.getElementById("addTextBtn")?.addEventListener("click", addText);
    document.getElementById("deleteTextBtn")?.addEventListener("click", deleteSelectedText);
    document.getElementById("downloadBtn")?.addEventListener("click", saveMeme);

    document.getElementById("copyLinkBtn")?.addEventListener("click", copyLink);
    document.getElementById("shareBtn")?.addEventListener("click", openShareModal);

    fontSize?.addEventListener("input", applyTextStyles);
    textColor?.addEventListener("input", applyTextStyles);
    strokeColor?.addEventListener("input", applyTextStyles);
    strokeWidth?.addEventListener("input", applyTextStyles);
});

// ============================
//  IMAGE UPLOAD & DRAW
// ============================
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
            image = img;
            drawImageToCanvas();
            document.getElementById("emptyState")?.style.display = "none";
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

function drawImageToCanvas() {
    if (!image) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// ============================
//  TEXT
// ============================
const textInput = document.getElementById("textInput");
const textsLayer = document.getElementById("textsLayer");
const canvasContainer = document.getElementById("canvasContainer");

function addText() {
    const div = document.createElement("div");
    div.className = "draggable-text";
    div.textContent = textInput.value || "Meme Text";

    div.style.position = "absolute";
    div.style.left = "50%";
    div.style.top = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.cursor = "move";

    textsLayer.appendChild(div);
    applyTextStylesTo(div);
    enableDrag(div);

    div.addEventListener("click", e => {
        e.stopPropagation();
        document.querySelectorAll(".draggable-text").forEach(t => t.style.outline = "none");
        selectedText = div;
        div.style.outline = "2px dashed red";
    });
}

textsLayer?.addEventListener("click", () => {
    document.querySelectorAll(".draggable-text").forEach(t => t.style.outline = "none");
    selectedText = null;
});

// ============================
//  DRAG
// ============================
function enableDrag(el) {
    let isDragging = false, offsetX = 0, offsetY = 0;

    el.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        const rect = canvasContainer.getBoundingClientRect();
        el.style.left = (e.clientX - rect.left - offsetX) + "px";
        el.style.top  = (e.clientY - rect.top - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => isDragging = false);
}

// ============================
//  TEXT STYLES
// ============================
const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");
const textColor = document.getElementById("textColor");
const strokeColor = document.getElementById("strokeColor");
const strokeWidth = document.getElementById("strokeWidth");
const strokeWidthValue = document.getElementById("strokeWidthValue");

function applyTextStylesTo(el) {
    el.style.fontSize = fontSize.value + "px";
    el.style.color = textColor.value;
    el.style.webkitTextStrokeColor = strokeColor.value;
    el.style.webkitTextStrokeWidth = strokeWidth.value + "px";

    fontSizeValue.textContent = fontSize.value + "px";
    strokeWidthValue.textContent = strokeWidth.value + "px";
}

function applyTextStyles() {
    if (selectedText) applyTextStylesTo(selectedText);
}

// ============================
//  DELETE TEXT
// ============================
function deleteSelectedText() {
    if (selectedText) {
        selectedText.remove();
        selectedText = null;
    }
}

// ============================
//  SAVE / DOWNLOAD
// ============================
function saveMeme() {
    drawImageToCanvas();

    document.querySelectorAll(".draggable-text").forEach(t => {
        const rect = t.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const x = rect.left - canvasRect.left + t.offsetWidth / 2;
        const y = rect.top  - canvasRect.top  + t.offsetHeight / 2;

        const style = getComputedStyle(t);
        const size = parseInt(style.fontSize);

        ctx.font = `${size}px Impact, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const strokeW = parseFloat(style.webkitTextStrokeWidth) || 0;
        if (strokeW > 0) {
            ctx.lineWidth = strokeW * 2;
            ctx.strokeStyle = style.webkitTextStrokeColor;
            ctx.strokeText(t.textContent, x, y);
        }

        ctx.fillStyle = style.color;
        ctx.fillText(t.textContent, x, y);
    });

    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// ============================
//  SHARE & COPY
// ============================
function openShareModal() {
    new bootstrap.Modal(document.getElementById("shareModal")).show();
}

async function copyLink() {
    const url = await uploadMemeToServer();
    if (!url) return;
    await navigator.clipboard.writeText(url);
    showNotification("تم نسخ الرابط!");
}

function showNotification(text) {
    const n = document.getElementById("notification");
    n.textContent = text;
    n.style.display = "block";
    setTimeout(() => n.style.display = "none", 3000);
}

// ============================
//  UPLOAD
// ============================
async function uploadMemeToServer() {
    if (!image) return null;

    drawImageToCanvas();
    saveMeme();

    const imgData = canvas.toDataURL("image/png");

    const res = await fetch("/memes/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData })
    });

    const data = await res.json();
    return data.status === "success"
        ? window.location.origin + data.file
        : null;
}

// ============================
//  SHARE PLATFORMS
// ============================
window.shareOn = async platform => {
    const url = await uploadMemeToServer();
    if (!url) return;

    const links = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        pinterest: `https://pinterest.com/pin/create/button/?media=${encodeURIComponent(url)}`
    };

    window.open(links[platform], "_blank");
}; */

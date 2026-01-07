

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
        // الطريقة الحديثة (تعمل فقط على HTTPS)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(imageUrl);
            showNotification("Link copied!");
            return;
        }

        // Fallback للمتصفحات القديمة / HTTP
        const tempInput = document.createElement("input");
        tempInput.value = imageUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        tempInput.remove();

        showNotification("Link copied!");
        
    } catch (err) {
        console.error("Copy failed:", err);
        alert("Failed to copy link.");
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
        alert("You need to upload an image first !");
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
    let isDragging = false;
    let grabDX = 0, grabDY = 0;
    let startX = 0, startY = 0;
    let moved = false;

    function startPointer(clientX, clientY) {
        isDragging = true;
        moved = false;

        startX = clientX;
        startY = clientY;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        grabDX = clientX - cx;
        grabDY = clientY - cy;
    }

    function movePointer(clientX, clientY) {
        if (!isDragging) return;

        // إذا كان التحرك بسيطًا لا نعتبره سحبًا بل ضغط فقط
        if (!moved && (Math.abs(clientX - startX) > 3 || Math.abs(clientY - startY) > 3)) {
            moved = true;
        }

        if (!moved) return;

        const rect = canvasContainer.getBoundingClientRect();
        const x = clientX - rect.left - grabDX;
        const y = clientY - rect.top - grabDY;

        el.style.left = x + "px";
        el.style.top  = y + "px";
    }

    function endPointer() {
        if (!isDragging) return;
        isDragging = false;

        // إذا لم يحصل سحب ⇒ اعتبرها تحديد النص
        if (!moved) {
            document.querySelectorAll(".draggable-text")
                .forEach(t => t.style.outline = "none");

            selectedText = el;
            el.style.outline = "2px dashed red";
            textInput.value = el.textContent;
        }
    }

    // ========== Desktop ==========
    el.addEventListener("mousedown", (e) => {
        startPointer(e.clientX, e.clientY);
    });

    document.addEventListener("mousemove", (e) => {
        movePointer(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", endPointer);

    // ========== Mobile ==========
    el.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startPointer(t.clientX, t.clientY);
    });

    document.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        movePointer(t.clientX, t.clientY);
    });

    document.addEventListener("touchend", endPointer);
}







// ============================
//  TEXT STYLE CONTROLS
// ============================


//========================
//  TEXT LAYER & ADDING TEXT
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
        alert("You need to upload an image first !");
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
        alert(" You need to upload an image first !");
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
            alert("Saving image failed ");
            return null;
        }
    } catch (error) {
        alert("Server not reachable");
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

 // فتح مودال المشاركة
window.openShareModal = function (event) {

    // أوقف كل الأحداث تماماً
    if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    // تحقق من وجود صورة قبل أي شيء
    if (!image) {
        alert("Please upload an image first");
        return;
    }

    // افتح المودال فقط إذا كانت هناك صورة
    const shareModal = document.getElementById("shareModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(shareModal);
    modalInstance.show();
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

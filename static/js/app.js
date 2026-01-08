

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


// //COPY LINK BUTTON
//     // ============================
// document.getElementById("copyLinkBtn").addEventListener("click", async () => {
//     const imageUrl = await uploadMemeToServer();
//     if (!imageUrl) return;

//     try {
//         // الطريقة الحديثة (تعمل فقط على HTTPS)
//         if (navigator.clipboard && window.isSecureContext) {
//             await navigator.clipboard.writeText(imageUrl);
//             showNotification("Link copied!");
//             return;
//         }

//         // Fallback للمتصفحات القديمة / HTTP
//         const tempInput = document.createElement("input");
//         tempInput.value = imageUrl;
//         document.body.appendChild(tempInput);
//         tempInput.select();
//         document.execCommand("copy");
//         tempInput.remove();

//         showNotification("Link copied!");
        
//     } catch (err) {
//         console.error("Copy failed:", err);
//         alert("Failed to copy link.");
//     }
// });
// // COPY LINK BUTTON
// // ============================
// document.getElementById("copyLinkBtn").addEventListener("click", async () => {

//     const imageUrl = await uploadMemeToServer();
//     if (!imageUrl) return;

//     // الطريقة الحديثة
//     try {
//         await navigator.clipboard.writeText(imageUrl);
//         showNotification("Link copied!");
//         return;
//     } catch (err) {
//         console.warn("Clipboard API failed, using fallback...", err);
//     }

//     // fallback المتوافق مع كل المتصفحات
//     try {
//         const tempInput = document.createElement("input");
//         tempInput.value = imageUrl;
//         document.body.appendChild(tempInput);

//         tempInput.select();
//         tempInput.setSelectionRange(0, 99999);

//         document.execCommand("copy");   // لا نعتمد على return value

//         document.body.removeChild(tempInput);

//         // إذا لم يقع خطأ → نعتبر النسخ ناجحًا
//         showNotification("Link copied!");
//     } catch {
//         alert("Failed to copy link.");
//     }
// });

//////////////////////////////////////
// //COPY LINK BUTTON
//     // ============================
//     document.getElementById("copyLinkBtn").addEventListener("click", async () => {
//         const imageUrl = await uploadMemeToServer();
//         if (!imageUrl) return;

//         try {
//             await navigator.clipboard.writeText(imageUrl);
//             showNotification("تم نسخ رابط الصورة!");
//         } catch {
//             alert("فشل نسخ الرابط");
//         }
// });


//COPY LINK BUTTON - الحل المؤكد
// ============================
document.getElementById("copyLinkBtn").addEventListener("click", async () => {
    const imageUrl = await uploadMemeToServer();
    if (!imageUrl) {
        alert("لا يوجد رابط للنسخ");
        return;
    }

    // دالة النسخ المحسنة
    function copyTextToClipboard(text) {
        // الطريقة 1: Clipboard API
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text)
                .then(() => true)
                .catch(() => false);
        }
        
        // الطريقة 2: الطريقة القديمة
        return new Promise((resolve) => {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.cssText = `
                    position: fixed;
                    left: -9999px;
                    top: -9999px;
                `;
                document.body.appendChild(textArea);
                textArea.select();
                
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                resolve(success);
            } catch {
                resolve(false);
            }
        });
    }
    
    // محاولة النسخ
    const success = await copyTextToClipboard(imageUrl);
    
    // عرض الرسالة المناسبة
    if (success) {
        showNotification("تم نسخ رابط الصورة!");
    } else {
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
        function selectText(div) {
    // إزالة التحديد عن بقية النصوص
    document.querySelectorAll(".draggable-text")
        .forEach(el => el.style.outline = "none");

    selectedText = div;
    div.style.outline = "2px dashed red";

    // عرض النص في الـ input لتعديله
    textInput.value = div.textContent;
}

// ===== Mouse (كمبيوتر) =====
div.addEventListener("click", (e) => {
    e.stopPropagation();
    selectText(div);
});

// ===== Touch (هاتف) =====
div.addEventListener("touchstart", (e) => {
    e.stopPropagation();
    selectText(div);
}, { passive: true });

   }

    // مسح الحقل بعد الإضافة أو التعديل
    textInput.value = "";
});
function clearSelection() {
    document.querySelectorAll(".draggable-text")
        .forEach(el => el.style.outline = "none");

    selectedText = null;
    textInput.value = "";
}

// كمبيوتر
canvasContainer.addEventListener("click", clearSelection);

// هاتف
canvasContainer.addEventListener("touchstart", clearSelection);



// ============================
//  DRAGGING TEXT - IMPROVED VERSION
// ============================

function enableDrag(el) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // ==== MOUSE DOWN (كمبيوتر) ====
    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        
        // تحديد النص أولاً
        selectText(el);
        
        // حساب الإزاحة من نقطة الضغط داخل النص
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        e.stopPropagation();
        e.preventDefault(); // لمنع اختيار النص
    });

    // ==== TOUCH START (هاتف) ====
    el.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        
        isDragging = true;
        const touch = e.touches[0];
        
        // تحديد النص أولاً
        selectText(el);
        
        // حساب الإزاحة من نقطة الضغط داخل النص
        const rect = el.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        
        e.stopPropagation();
    }, { passive: true });

    // ==== MOUSE MOVE ====
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        
        const containerRect = canvasContainer.getBoundingClientRect();
        
        // حساب الموضع الجديد بناءً على الإزاحة
        el.style.left = (e.clientX - containerRect.left - offsetX) + "px";
        el.style.top = (e.clientY - containerRect.top - offsetY) + "px";
    });

    // ==== TOUCH MOVE ====
    document.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const containerRect = canvasContainer.getBoundingClientRect();
        
        // حساب الموضع الجديد
        el.style.left = (touch.clientX - containerRect.left - offsetX) + "px";
        el.style.top = (touch.clientY - containerRect.top - offsetY) + "px";
        
        e.preventDefault(); // لمنع scroll الصفحة
    }, { passive: false });

    // ==== STOP DRAGGING ====
    const stopDragging = () => {
        isDragging = false;
    };
    
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);
    document.addEventListener("touchcancel", stopDragging);
}
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

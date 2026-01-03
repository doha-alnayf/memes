# from django.shortcuts import render

# # Create your views here.
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from .models import Meme

# @csrf_exempt
# def save_meme(request):
#     if request.method == 'POST' and request.FILES.get('image'):
#         meme = Meme.objects.create(image=request.FILES['image'])
#         return JsonResponse({
#             'status': 'success',
#             'id': meme.id
#         })
#     return JsonResponse({'status': 'error'}, status=400)



# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
# def save_meme(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         image_data = data.get("image")

#         if image_data:  
#             return JsonResponse({
#                 "status": "success",
#                 "message": "Image received"
#             })

#         return JsonResponse({"status": "error"}, status=400)

#     return JsonResponse({"status": "error"}, status=400)



import base64
import json
import uuid
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
def save_meme(request):
    if request.method == "POST":
        data = json.loads(request.body)
        image_data = data.get("image")

        if not image_data:
            return JsonResponse({"status": "error"}, status=400)

        # إزالة رأس base64
        format, imgstr = image_data.split(";base64,")
        ext = format.split("/")[-1]

        # فك الترميز
        image_bytes = base64.b64decode(imgstr)

        # إنشاء اسم ملف
        filename = f"{uuid.uuid4()}.{ext}"
        save_path = os.path.join(settings.MEDIA_ROOT, "memes")

        os.makedirs(save_path, exist_ok=True)

        file_path = os.path.join(save_path, filename)

        # حفظ الصورة
        with open(file_path, "wb") as f:
            f.write(image_bytes)

        return JsonResponse({
            "status": "success",
            "file": f"{settings.MEDIA_URL}memes/{filename}"
        })

    return JsonResponse({"status": "error"}, status=400)

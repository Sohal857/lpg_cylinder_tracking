import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import io
import numpy as np
from paddleocr import PaddleOCR
from django.shortcuts import render

ocr = PaddleOCR(use_angle_cls=True, lang='en')

@csrf_exempt
def process_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes))
        # you may need to resize the image to 350*350
        image = image.resize((350,350))
        image_np = np.array(image)

        # PaddleOCR processing
        result = ocr.ocr(image_np)
        extracted_text = ""
        for res in result:
            for line in res:
                extracted_text += line[1][0] + " "
        extracted_text = extracted_text.strip()
        extracted_text = extracted_text.replace(" ", "")

        #validation

        if len(extracted_text) != 8 or not extracted_text.isnumeric():
            return JsonResponse({'error': 'Invalid format, expected 8 digits'}, status=400)

        # if the output format is not exactly as the requirement, then handle the formatting

        output = {
                "number": extracted_text
            }

        return JsonResponse(output)
    else:
        return JsonResponse({'error': "image not found"}, status=400)

def index(request):
    return render(request, 'index.html')

def camera_view(request):
    return render(request, 'camera.html')
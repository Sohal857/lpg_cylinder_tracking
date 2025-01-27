const videoElement = document.getElementById('camera-feed');
if (videoElement) {
    // Start camera access using getUserMedia
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
        videoElement.srcObject = stream;
    });
    document.getElementById('captureButton').addEventListener('click', async (event) => {
        event.preventDefault();
        const loadingDiv = document.getElementById('loading');
         const errorDiv = document.getElementById('error-div')
        const loadingText = document.getElementById('loading-text');
          const errorText = document.getElementById('error-text');
        // Capture current frame from the video
        loadingDiv.style.display = 'block';
         errorText.innerText = '';
        errorDiv.style.display = 'none';
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageBlob = await new Promise(resolve => canvas.toBlob(resolve));
        const formData = new FormData(document.querySelector('form'));
        const image_file = new File([imageBlob], 'captured_image.jpg', { type: 'image/jpeg' });
        formData.set('image', image_file);
        try {
            const response = await fetch('/cylinder_reg/process_image/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value,
                }
            });
            const result = await response.json();
            if (response.ok) {
                const urlParams = new URLSearchParams(window.location.search);
                const number = result.number
                 if(number){
                     for (let i = 0; i < 8; i++) {
                         const box = window.opener.document.getElementById(`box${i + 1}`)
                         box.value = number[i];
                      }
                  }
               loadingDiv.style.display = 'none';
                 errorDiv.style.display = 'none';
                window.close();
            } else {
               loadingDiv.style.display = 'none';
               errorDiv.style.display = 'block';
                errorText.innerText = "Please take another picture";
               console.log(result);
          }
        } catch (e) {
           loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
             errorText.innerText = "Please Try again";
           console.log(e);
        }
    });
}
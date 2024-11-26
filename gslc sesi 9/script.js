document.getElementById('convertBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const conversionType = document.getElementById('conversionType').value;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (!fileInput.files[0]) {
        alert('Please select an image!');
        return;
    }

    const file = fileInput.files[0];
    const img = new Image();
    
    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        if (conversionType === 'grayscale') {
            applyGrayscale(ctx, canvas);
        } else if (conversionType === 'blur') {
            applyBlur(ctx, canvas);
        }
    }
});

function applyGrayscale(ctx, canvas) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = data[i + 1] = data[i + 2] = gray;
    }

    ctx.putImageData(imgData, 0, 0);
}

function applyBlur(ctx, canvas) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const width = canvas.width;
    const height = canvas.height;
    const radius = 15;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            let r = 0, g = 0, b = 0, count = 0;

            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;

                    if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
                        const neighborIndex = (ny * width + nx) * 4;
                        r += data[neighborIndex];
                        g += data[neighborIndex + 1];
                        b += data[neighborIndex + 2];
                        count++;
                    }
                }
            }

            data[index] = r / count;
            data[index + 1] = g / count;
            data[index + 2] = b / count;
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

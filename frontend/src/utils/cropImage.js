export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    const canvas = document.createElement("canvas");
    const image = new Image();

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const ctx = canvas.getContext("2d");
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }

                const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
                resolve(file);
            }, "image/jpeg");
        };

        image.onerror = reject;
        image.src = imageSrc;
    });
};

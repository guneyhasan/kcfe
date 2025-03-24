export const compressImage = async (base64Image, maxSizeInMB = 1) => {
  try {
    // Base64'ü Blob'a çevir
    const blob = await fetch(base64Image).then(r => r.blob());
    
    // Hedef boyut (bytes)
    const targetSize = maxSizeInMB * 1024 * 1024;
    
    if (blob.size <= targetSize) {
      return base64Image; // Zaten yeterince küçük
    }

    // Kalite oranını hesapla
    const quality = Math.min(1, targetSize / blob.size);

    // Canvas oluştur
    const img = new Image();
    await new Promise(resolve => {
      img.onload = resolve;
      img.src = base64Image;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Orijinal en-boy oranını koru
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Resmi canvas'a çiz
    ctx.drawImage(img, 0, 0);
    
    // Sıkıştırılmış base64'ü döndür
    return canvas.toDataURL('image/jpeg', quality);
  } catch (error) {
    console.error('Resim sıkıştırma hatası:', error);
    throw error;
  }
}; 
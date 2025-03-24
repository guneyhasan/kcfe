export const compressImage = async (file) => {
  try {
    // Dosyayı önce base64'e çevir
    const base64String = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });

    // Base64'ü Image nesnesine yükle
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = base64String;
    });

    // Canvas oluştur
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Maksimum boyutlar (1MB için yaklaşık değerler)
    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;

    // En-boy oranını koru
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    canvas.width = width;
    canvas.height = height;

    // Resmi canvas'a çiz
    ctx.drawImage(img, 0, 0, width, height);

    // Sıkıştırılmış base64'ü döndür
    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
    
    // Base64 header'ı kaldır
    return compressedBase64.split(',')[1];
  } catch (error) {
    console.error('Resim sıkıştırma hatası:', error);
    throw new Error('Resim sıkıştırma işlemi başarısız oldu');
  }
}; 
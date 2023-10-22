// Separate function for image upload
export async function uploadImageToImageKit(imagekit, file) {
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname + Date.now(),
      extensions: [
        {
          name: 'google-auto-tagging',
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });
    return response; // Return the ImageKit response
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
}
export async function deleteImageFromImageKit(imagekit, id) {
  await imagekit.deleteFile(id, (error, result) => {
    if (error) console.log('Error deleting file===>', error);
    else console.log(result);
  });
}

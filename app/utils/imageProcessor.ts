import { storage } from "~/firebase.client";
import { ref, uploadBytes, getDownloadURL, listAll, getMetadata } from "firebase/storage";

export async function uploadFungiImages(
  codigoFungario: string,
  imageFiles: File[]
): Promise<string[]> {
  const uploadPromises = imageFiles.map(async (file, index) => {
    const fileName = `${codigoFungario}_${index + 1}_${file.name}`;
    const imageRef = ref(storage, `fungi/${codigoFungario}/${fileName}`);
    
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  });
  
  return Promise.all(uploadPromises);
}

export async function getLocalImagePaths(codigoFungario: string): Promise<string[]> {
  // Extract the code number to determine the year
  const code = codigoFungario.replace("FRFA-", "");
  const codeNumber = parseInt(code);
  
  // Determine year based on code number
  let year = "2024";
  if (codeNumber >= 60) {
    year = "2025";
  }
  
  // Construct the local path
  const localPath = `/Users/omrinuri/projects/revolucion-fungi/2024/${year}/${codigoFungario}/Bajas_/`;
  
  return [];
}

export async function copyLocalImagesToFirebase(codigoFungario: string): Promise<string[]> {
  // This function would need Node.js filesystem access
  // For now, returning empty array as this would be implemented server-side
  console.log(`Would copy images from local path for ${codigoFungario}`);
  return [];
}

export function generateImageFileName(codigoFungario: string, originalName: string, index: number): string {
  const extension = originalName.split('.').pop();
  return `${codigoFungario}_${String(index + 1).padStart(2, '0')}.${extension}`;
}

async function checkExistingImages(codigoFungario: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, `fungi/${codigoFungario}/`);
    const result = await listAll(folderRef);
    
    const existingUrls: string[] = [];
    for (const itemRef of result.items) {
      try {
        const url = await getDownloadURL(itemRef);
        existingUrls.push(url);
      } catch (error) {
        console.error(`Error getting download URL for ${itemRef.name}:`, error);
      }
    }
    
    return existingUrls;
  } catch (error) {
    // Folder doesn't exist or other error
    console.log(`No existing images found for ${codigoFungario}`);
    return [];
  }
}

export async function processAndUploadImages(
  codigoFungario: string,
  files: File[]
): Promise<string[]> {
  // Check for existing images first
  console.log(`Checking for existing images for ${codigoFungario}...`);
  const existingUrls = await checkExistingImages(codigoFungario);
  
  if (existingUrls.length > 0) {
    console.log(`Found ${existingUrls.length} existing images for ${codigoFungario}, skipping upload`);
    return existingUrls;
  }
  
  console.log(`No existing images found, uploading ${files.length} new images for ${codigoFungario}...`);
  const uploadedUrls: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = generateImageFileName(codigoFungario, file.name, i);
    
    try {
      const imageRef = ref(storage, `fungi/${codigoFungario}/${fileName}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      uploadedUrls.push(downloadURL);
      console.log(`Uploaded ${fileName}`);
    } catch (error) {
      console.error(`Error uploading image ${fileName}:`, error);
    }
  }
  
  return uploadedUrls;
}

export async function uploadLocalImages(codigoFungario: string): Promise<string[]> {
  // Since we're in the browser, we can't directly access the local file system
  // This function would need to be implemented server-side or use a different approach
  
  // For now, we'll create placeholder URLs or return empty array
  // In a real implementation, you would either:
  // 1. Have a server-side function that reads the local directory and uploads files
  // 2. Use a file input to let users select the photo folder
  // 3. Have the photos already uploaded to a cloud storage and reference them
  
  console.warn(`uploadLocalImages: Cannot access local files for ${codigoFungario} from browser`);
  
  // Extract the code number to determine the year
  const code = codigoFungario.replace("FRFA-", "");
  const codeNumber = parseInt(code);
  
  // Determine year based on code number
  let year = "2024";
  if (codeNumber >= 60) {
    year = "2025";
  }
  
  // This would be the local path: `/Users/omrinuri/projects/revolucion-fungi/2024/${year}/${codigoFungario}/Bajas_/`
  // For testing, return empty array since we can't access local files from browser
  return [];
}
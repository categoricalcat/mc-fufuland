import AdmZip from "adm-zip";

/**
 * Compresses a folder into a zip file
 * @param folder - Path to the folder to compress
 * @param outZip - Path where the output zip file will be created
 * @returns Promise that resolves when the zip file has been created
 * @throws Will throw an error if compression fails
 */
export const zipFolder = (folder: string, outZip: string): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip();
      zip.addLocalFolder(folder);
      zip.writeZip(outZip, (err) => (err ? reject(err) : resolve()));
    } catch (err) {
      reject(err);
    }
  }); 
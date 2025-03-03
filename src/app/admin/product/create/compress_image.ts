export const CompressImage = (image: File, rate: number = 0.25): Promise<File> => {
    return new Promise((resolve, reject) => {
        const fName = image.name.split(".")[0]
        const img = new Image()
        const reader = new FileReader();

        reader.onload = e => { img.src = e.target?.result as string }
        reader.readAsDataURL(image);

        img.onload = () => {

            const canvas = document.createElement("canvas")
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d")
            ctx?.drawImage(img, 0, 0)

            canvas.toBlob(blob => {
                if(!blob) return reject();
                const file = new File([blob], fName + "jpeg")
                // console.info("File Size", file.size)
                resolve(file)

            }, "image/jpeg", rate)
        }

    })

}

export const CompressAndEncode = <T>(image: File, rate?: number): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        const compressed = await CompressImage(image, rate)

        console.log("Before", image.size)
        console.log("After", compressed.size)
    
        const fr = new FileReader();
        fr.onload = (e) => {
            const result = e.target?.result as unknown;
            resolve(result as T)
        }
        fr.onerror = e => reject(e);
        fr.readAsDataURL(compressed)
    })
}
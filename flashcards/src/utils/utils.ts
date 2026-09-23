import { open } from '@tauri-apps/plugin-dialog'

export const pickImageFromDisk = async (callback: (path: string) => void) => {
    try {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'Images', extensions: ['pngs', 'jpg', 'jpeg', 'webp', 'gif'] }]
        })
        if (selected && typeof selected === 'string') {
            // returns local path ("C:/../image.png")
            callback(selected)
        }
    } catch (error) {
        console.error('File error:', error)
    }
}
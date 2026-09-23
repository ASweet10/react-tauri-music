import { convertFileSrc } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'

export const pickImageFromDisk = async (callback: (path: string) => void) => {
    try {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'Images', extensions: ['pngs', 'jpg', 'jpeg', 'webp', 'gif'] }]
        })
        if (selected && typeof selected === 'string') {
            // Convert "C:/../image.png" to "asset://localhost/..."
            const imageUrl = convertFileSrc(selected as string)
            callback(imageUrl)
        }
    } catch (error) {
        console.error('File error:', error)
    }
}
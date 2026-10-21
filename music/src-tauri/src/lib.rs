mod commands;

// Tauri entry point builder
#[cfg_attr(mobile, tauri::mobile_entry_point)] // or your default Tauri mobile/desktop entry setup
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![commands::scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
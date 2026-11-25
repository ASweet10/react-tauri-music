mod commands;

// Tauri entry point builder
#[cfg_attr(mobile, tauri::mobile_entry_point)] // or your default Tauri mobile/desktop entry setup
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::tracks::scan_directory,
            commands::tracks::fetch_all_tracks,
            commands::tracks::get_directories,
            commands::tracks::add_directory,
            commands::tracks::delete_directory,
            commands::library::get_track_stats,
            commands::library::set_track_liked,
            commands::library::increment_track_play_count
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
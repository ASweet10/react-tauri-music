pub fn clean_track_title(raw_title: &str) -> String {
  raw_title.trim().to_string()
}

pub fn clean_title_command(title: &str) -> String {
  clean_track_title(title)
}

// Rust testing convention
#[cfg(test)]
mod tests {

  #[test]
  fn test_clean_title() {
    let result = clean_track_title("      Hangar 18    \n".to_string());
    assert_eq!(result, "Hangar 18");
  }
}

// Tauri entry point builder
#[cfg_attr(mobile, tauri::mobile_entry_point)] // or your default Tauri mobile/desktop entry setup
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

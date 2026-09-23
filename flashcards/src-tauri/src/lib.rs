// Main entry point; Rust commands exposed to frontend
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

// Individual flashcard
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Card {
  pub id: String,
  pub question: String,
  pub answer: String,
  pub image_url: String,
}

// Deck containing flashcard array
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Deck {
  pub id: String,
  pub title: String,
  pub image_url: String,
  pub cards: Vec<Card>,
}

// In-memory state managed by Rust
pub struct AppState {
  pub decks: Mutex<Vec<Deck>>,
}

// Payload sent from React when creating deck
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDeckPayload {
  pub title: String,
  pub image_url: String,
  pub cards: Vec<Card>,
}


#[tauri::command]
fn create_deck(payload: CreateDeckPayload, state: State<'_, AppState>,) -> Result<Vec<Deck>, String> {
  let mut decks = state
    .decks
    .lock()
    .map_err(|_| "Failed to lock state".to_string())?;

  let new_deck = Deck {
    id: format!("deck_{}", decks.len() + 1),
    title: payload.title,
    image_url: if payload.image_url.is_empty() {
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80".to_string()
    } else {
      payload.image_url
    },
    cards: payload.cards,
  };

  decks.push(new_deck);
  Ok(decks.clone())
}

// Retrieve deck array from state
#[tauri::command]
fn get_decks(state: State<'_, AppState>) -> Result<Vec<Deck>, String> {
  let decks = state
    .decks
    .lock()
    .map_err(|_| "Failed to lock app state".to_string())?;
  Ok(decks.clone())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(AppState {
      decks: Mutex::new(vec![]),
    })
    .plugin(tauri_plugin_dialog::init())
    .invoke_handler(tauri::generate_handler![create_deck, get_decks])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
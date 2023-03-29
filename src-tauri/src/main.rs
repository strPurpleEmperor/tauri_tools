#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![windows_subsystem = "windows"]
use std::error::Error;
use crate::types::{HREF, PDF, STATUS};

mod get_pdf;
mod types;
mod get_href;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn get_one_pdf(url: String) -> Result<PDF, String> {
   get_pdf::get_pdf(url)
}

#[tauri::command]
async fn get_url_list(url: String) -> Vec<HREF> {
   get_href::get_hrefs(url)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_one_pdf,get_url_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



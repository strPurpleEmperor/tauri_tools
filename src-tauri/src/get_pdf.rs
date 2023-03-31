use std::error::Error;
use std::{thread, time};
use std::ffi::OsString;
use std::thread::sleep;
use std::time::Duration;

use headless_chrome::{Browser, FetcherOptions, LaunchOptions};
use headless_chrome::protocol::cdp::Page;
use headless_chrome::types::{PrintToPdfOptions, TransferMode};
use crate::types::PDF;

pub fn print_pdf(url:String) -> Result<PDF,Box<dyn Error>>{
    println!("url:{}",url);
    let browser = Browser::default()?;
    let tab = browser.new_tab()?;
    tab.navigate_to(&*url)?;
    let ten_millis = Duration::from_millis(3000);
    sleep(ten_millis);
    let title = tab.find_element("title")?.get_inner_text()?;
    let pdf = tab.print_to_pdf(Option::from(PrintToPdfOptions{
        landscape: None,
        display_header_footer: Option::from(false),
        print_background: Option::from(true),
        scale: None,
        paper_width: None,
        paper_height: None,
        margin_top: None,
        margin_bottom: None,
        margin_left: None,
        margin_right: None,
        page_ranges: None,
        ignore_invalid_page_ranges: None,
        header_template: None,
        footer_template: None,
        prefer_css_page_size: None,
        transfer_mode: None
    }))?;
    let img = tab.capture_screenshot(
        Page::CaptureScreenshotFormatOption::Jpeg,
        None,
        None,
        true)?;
    Ok(PDF{
        title,
        pdf,
        img,
        status: true,
        url
    })
}

pub fn get_pdf(url:String)->Result<PDF,String>{
    let pdf = print_pdf(url.clone());
    Ok(match pdf {
        Ok(res)=>{
            res
        }
        Err(e)=>{
            PDF {
                title: "".to_string(),
                pdf: vec![],
                img: vec![],
                status: false,
                url
            }
        }
    })
}
use std::error::Error;
use std::{thread, time};
use std::ffi::OsString;
use std::thread::sleep;
use std::time::Duration;

use headless_chrome::{Browser, Element, FetcherOptions, LaunchOptions};
use headless_chrome::protocol::cdp::Page;
use headless_chrome::types::{PrintToPdfOptions, TransferMode};
use crate::types::{HREF, PDF};

fn fetch_href(url:String) -> Result<Vec<HREF>,Box<dyn Error>>{
    let browser = Browser::default()?;
    let tab = browser.new_tab()?;
    tab.navigate_to(&*url)?;
    let ten_millis = Duration::from_millis(3000);
    sleep(ten_millis);
    let els = tab.find_elements("a")?;
    let mut  hrefs = Vec::new();
    for el in els {
        hrefs.push(HREF{
            name: el.get_inner_text().unwrap(),
            url: get_href(el).unwrap()
        });

    }
    Ok(hrefs)
}
fn get_href(el:Element)-> Result<String,Box<dyn Error>> {
    let text: String = serde_json::from_value(
        el.call_js_fn("function() { return this.href }", vec![], false)?
            .value
            .unwrap(),
    )?;
    Ok(text)
}
pub fn get_hrefs(url:String) -> Vec<HREF> {
    let href = fetch_href(url.clone());
    match href {
        Ok(res)=>{
            res
        }
        Err(_e)=>{
            vec![]
        }
    }
}
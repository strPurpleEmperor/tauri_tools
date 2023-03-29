use serde::{Deserialize, Serialize};
#[derive(Debug, Deserialize, Serialize)]
pub struct PDF {
    pub title:String,
    pub pdf:Vec<u8>,
    pub img:Vec<u8>,
    pub status: bool,
    pub url:String,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct HREF {
    pub name:String,
    pub url:String,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct STATUS {
    pub from:String,
    pub to:String,
}
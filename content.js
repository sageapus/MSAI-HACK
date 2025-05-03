console.log("✅ content.js is running");
function detectActivity(){
    if (document.querySelector("video")){
        return "video"}
    

    const elements= document.querySelectorAll("*")
    for(const element of elements){
        if (element.className.toLowerCase().includes("price")){
            return "shopping"
        }
    }

    if (document.querySelector("article")|| document.querySelector('[class*="blog"]')){
        return "reading"
    }

    else{
        return "general"
    }
}

function scrapeData(activityType){
    if (activityType==="video"){
        const videoTitle=document.querySelector('[class*="title"]')?.textContent?.trim()
        const channelName=document.querySelector('[class*="channel"]')?.textContent?.trim()

        return { title: videoTitle || "Unknown Title", name: channelName || "Unknown Channel" };
        }

    if(activityType==="reading"){
        const blogTitle=document.querySelector('[class*="title"]')?.textContent?.trim()
        const creator=document.querySelector('[class*="author"],[class*="creator"],[class*="writer"]')?.textContent?.trim()

        return { title: blogTitle || "Unknown Title", author: creator || "Unknown author" };
    }
    if(activityType === "shopping"){
        const product= document.querySelector('[class*="product"]')?.textContent?.trim()
        const prices = document.querySelector('[class*="price"]')?.textContent?.trim()
        
        return { product: product || "Unknown name ", price: prices  || "Unknown price" };

    }
    
    return { message: 'No specific data available.' };
}
const activity = detectActivity();
chrome.runtime.sendMessage({ action: "pageActivity", activity: activity });
if (typeof window === "object"){
    console.log("ok");
}else{
    console.log("not ok");
}

let scrapeEmails = document.getElementById('scrapeEmails');

let list = document.getElementById('emailList');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let emails = request.enmails;
    
    if(emails == null || emails.length == 0){
         let li = document.createElement('li');
         li.innerText("No Emails Found");
         list.appendChild(li);
    }else{
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
    }
})

scrapeEmails.addEventListener("click", async () => { 
    
    let [tab] = await chrome.tabs.query({
        active: true, 
        currentWindow: true
    });

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,

    });
})

function scrapeEmailsFromPage(){
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    let emails = document.body.innerHTML.match(emailRegEx);

    chrome.runtime.sendMessage({emails});

}


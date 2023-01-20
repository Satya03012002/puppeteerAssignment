const puppeteer = require("puppeteer")
let url = "https://internshala.com/chat/c-0";

const load = async(url) =>{

    try {
        // load the browser
        const browser = await puppeteer.launch({ headless: false })

        // open new tab and go to url
        const page = await browser.newPage();
        await page.goto(url);

        // it will show login page show select the text area and write email and password

        const userName = await page.$("#email");
        await userName.type("########") // write your email

        const password = await page.$("#password");
        await password.type("#########")// write your password

        // select login button enter login buttton
        const enter = await page.$("#login_submit");
        await enter.click()

        // wait till this selector id not loaded
        await page.waitForSelector("#chat_group")
        
        // get all the href of  text message
        // page.evaluate basically evaluate a function in a page context and return the result
        const hrefdata = await page.evaluate(() => {

           // with the help of document.querySelectorAll i select all the chat list item
           // it return an array of all chat list item
            const searchurl = document.querySelectorAll(".chat_list_item")
            
            const temp = []
            
            // iterate all chat list item  and made an object of attribute href and push into the temp array and return
            searchurl.forEach(item => {
                let linkurl = {
                    href: item.querySelector(" span a").href,
                    name : item.querySelector("span a .name_header .partner_name .name").innerHTML
                }

                temp.push(linkurl)
            })
            return temp
        })

        console.log(hrefdata)




       // iterate the href array and visit each link 
       // wait till link page is not loaded
       // select the text area
       // write the text using 'type'
       //  slect the send button
       // press send button using 'click


        for (let i = 0; i < hrefdata.length; i++) {


            if(hrefdata[i].name == 'Shunya.ek' ){
              

                let newtab = await browser.newPage();
                await newtab.goto(hrefdata[i].href);
                await newtab.waitForSelector("#chat_history_container > div.message_history_element")
    
                const inputmsg = await newtab.$("#message_input");
                if (inputmsg) {
                    await inputmsg.type("plz ignore this text")
                    const res = await newtab.$('#chat_send_button > i')
                    await res.click();
                    await newtab.close() // to close the page
                }
                 //window.history.go(-1) // for go back
            }
           

        

        }     

       


    } catch (err) {
        console.log(err)
    }




    // await browser.close();

    
}

load(url)
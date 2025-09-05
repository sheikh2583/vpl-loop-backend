console.log("Email Writer Extension - Firefox Version Loaded");

// Test backend connectivity
async function testBackendConnection() {
    try {
        const response = await fetch('http://localhost:8080/api/email/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain, application/json'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({
                emailContent: "test",
                tone: "professional"
            })
        });
        console.log('Backend connection test:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
    }
}

// Test connection when extension loads
setTimeout(() => {
    testBackendConnection().then(connected => {
        if (connected) {
            console.log('✅ Backend server is accessible');
        } else {
            console.log('❌ Backend server is not accessible - make sure it\'s running on http://localhost:8080');
        }
    });
}, 2000);
function createAIButton()
{
    const button = document.createElement('div');
    button.className='T-I J-J5-Ji ao0 v7 T-I-atl L3';
    button.style.marginRight= '8px';
    button.innerHTML ='AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;
}
function getEmailContent()
{
    const selectors =[
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]',

    ];
    for(const selector of selectors)
    {
        const content =document.querySelector(selector);
        if(content)
        {
            return content.innerText.trim();
        }
    }
    return '';
}
function findComposeToolbar()
{
    const selectors =[
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'

    ];
    for(const selector of selectors)
    {
        const toolbar =document.querySelector(selector);
        if(toolbar)
        {
            return toolbar;
        }
    }
    return null;
}

function isInComposeWindow() {
    // Check if we're actually in a compose/reply window
    const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
    const composeDialog = document.querySelector('[role="dialog"]');
    return composeBox && composeDialog;
}

// Track the last generated reply to enable clearing
let lastGeneratedReply = '';
let isGenerating = false;

function clearPreviousAIReply() {
    const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
    if (composeBox) {
        // Simply clear all content in the compose box
        composeBox.innerHTML = '';
        composeBox.focus();
        lastGeneratedReply = '';
        return true;
    }
    return false;
}
function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();
    
    // Only inject button if we're in a compose window
    if (!isInComposeWindow()) {
        console.log("Not in compose window, skipping button injection");
        return;
    }
    
    const toolbar =findComposeToolbar();
    if(!toolbar)
    {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async() =>
    {
        // Prevent multiple simultaneous generations
        if (isGenerating) {
            console.log("Already generating, ignoring click");
            return;
        }
        
       try{
        isGenerating = true;
        
        // Check if there's content in compose box and clear it
        const currentComposeBox = document.querySelector('[role="textbox"][g_editable="true"]');
        if (currentComposeBox && currentComposeBox.innerText.trim()) {
            clearPreviousAIReply();
            button.innerHTML = 'Cleared - Generating...';
        } else {
            button.innerHTML = 'Generating...';
        }
        
        button.disabled=true;

        const emailContent=getEmailContent();
        
        // Show tone selection dialog
        const tone = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.background = '#fff';
            dialog.style.border = '1px solid #ccc';
            dialog.style.padding = '20px';
            dialog.style.zIndex = '9999';
            dialog.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            dialog.innerHTML = `
                <div style="margin-bottom:10px;font-weight:bold;">Select Reply Tone:</div>
                <button style="margin-right:8px;" id="tone-professional">Professional</button>
                <button style="margin-right:8px;" id="tone-casual">Casual</button>
                <button id="tone-friendly">Friendly</button>
            `;
            document.body.appendChild(dialog);

            dialog.querySelector('#tone-professional').onclick = () => {
                document.body.removeChild(dialog);
                resolve('professional');
            };
            dialog.querySelector('#tone-casual').onclick = () => {
                document.body.removeChild(dialog);
                resolve('casual');
            };
            dialog.querySelector('#tone-friendly').onclick = () => {
                document.body.removeChild(dialog);
                resolve('friendly');
            };
        });
        
        const response= await fetch('http://localhost:8080/api/email/generate',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'text/plain, application/json'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(
                {
                    emailContent: emailContent,
                    tone: tone
                }
            )
        });
        if(!response.ok)
        {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`API Request Failed: ${response.status} - ${errorText}`);
        }
        const generatedReply=await response.text();
        lastGeneratedReply = generatedReply; // Store the generated reply
        
        const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
        if(composeBox)
        {
            composeBox.focus();
            document.execCommand('insertText', false, generatedReply);
        }
        else{
            console.error('Compose box was not found');
        }
       } catch(error){
            console.error('Extension Error:', error);
            let errorMessage = 'Failed to generate reply';
            
            if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = 'Cannot connect to backend server. Make sure it\'s running on http://localhost:8080';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORS error. Backend server needs to allow Firefox origin.';
            } else if (error.message.includes('API Request Failed')) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
       }finally{
        button.innerHTML='AI Reply';
        button.disabled=false;
        isGenerating = false;
       }
    });
    toolbar.insertBefore(button, toolbar.firstChild);
}

// Check for existing compose windows when script loads
setTimeout(() => {
    const existingCompose = document.querySelector('.aDh, .btC, [role="dialog"]');
    if (existingCompose && isInComposeWindow()) {
        console.log("Existing compose window found on load");
        injectButton();
    }
}, 1000);

const observer = new MutationObserver((mutations) =>
{
    for(const mutation of mutations)
    {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node=>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if(hasComposeElements)
        {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body,
{
    childList: true,
    subtree: true
});

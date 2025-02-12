// Improved regex pattern for partial matches
const citationPattern = /\([A-Z][a-zA-Z]+(?:,| et al.,)?\s*(?:\d{4})?/;

// Store original content for restoration
let originalContent = new WeakMap();

// Message listener for extension commands
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.action === 'hide') {
            hideCitations();
            sendResponse({ 
                status: 'success',
                message: 'Citations successfully hidden in'
            });
        } else if (message.action === 'restore') {
            restoreCitations();
            sendResponse({ 
                status: 'success',
                message: 'Citations restored'
            });
        } else if (message.action === 'highlight'){
            highlightCitations();
            sendResponse({
                status: 'success',
                message: 'Citations higlighted'
            })
        }
    } catch (error) {
        console.error('Error in message listener:', error);
        sendResponse({ 
            status: 'error',
            message: error.message
        });
    }
    return true;
});

// Main function to hide citations
function hideCitations() {
    console.log("Starting citation removal process...");
    const startTime = performance.now();
    
    try {
        const paragraphs = document.getElementsByTagName('p');
        Array.from(paragraphs).forEach(p => {
            processParagraphHideShowCitations(p, true);
        });
        
        const endTime = performance.now();
        console.log(`Citation removal completed in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
        console.error('Error during citation removal:', error);
        throw error;
    }
}

function highlightCitations(){
    console.log("Starting citation highlight process...");
    const startTime = performance.now();
    try{
        const paragraphs = document.getElementsByTagName('p');
        Array.from(paragraphs).forEach(p=>{
            processParagraphHighlightCitations(p, true)
        })
        const endTime = performance.now();
        console.log(`Citation highlight completed in ${(endTime - startTime).toFixed(2)}ms`);
    }catch(error){
        console.error('Error during citation highlight:', error);
        throw error;
    }
}

// Function to restore citations
function restoreCitations() {
    console.log("Starting citation restoration process...");
    const startTime = performance.now();
    
    try {
        const paragraphs = document.getElementsByTagName('p');
        Array.from(paragraphs).forEach(p => {
            processParagraphHideShowCitations(p, false);
        });
        
        const endTime = performance.now();
        console.log(`Citation restoration completed in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
        console.error('Error during citation restoration:', error);
        throw error;
    }
}

function processParagraphHighlightCitations(paragraph, shouldHighlight){
    if (shouldHighlight && !originalContent.has(paragraph)) {
        originalContent.set(paragraph, paragraph.innerHTML);
    }
    if (shouldHighlight) {
        let text = paragraph.innerHTML;
        const citationBlocks = text.match(/\([^)]+\)/g) || [];
        
        citationBlocks.forEach(block => {
            if (isCitation(block)) {
                text = text.replace(block, `<mark>${block}</mark>`);
            }
        });
        
        paragraph.innerHTML = text;
    } else {
        const original = originalContent.get(paragraph);
        if (original) {
            paragraph.innerHTML = original;
            originalContent.delete(paragraph);
        }
    }
}

function processParagraphHideShowCitations(paragraph, shouldHide) {
    if (shouldHide && !originalContent.has(paragraph)) {
        originalContent.set(paragraph, paragraph.innerHTML);
    }
    
    if (shouldHide) {
        let text = paragraph.innerHTML;
        const citationBlocks = text.match(/\([^)]+\)/g) || [];
        
        citationBlocks.forEach(block => {
            if (isCitation(block)) {
                text = text.replace(block, '');
            }
        });
        
        paragraph.innerHTML = text;
    } else {
        const original = originalContent.get(paragraph);
        if (original) {
            paragraph.innerHTML = original;
            originalContent.delete(paragraph);
        }
    }
}

function isCitation(block) {
    const plainText = block.replace(/<[^>]+>/g, '');
    return citationPattern.test(plainText);
}

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});

observer.observe({ entryTypes: ['measure'] });

console.log("Enhanced citation remover script loaded successfully");
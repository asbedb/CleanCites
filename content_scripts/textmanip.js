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
    const plainText = block.replace(/<[^>]+>/g, '');  // Remove HTML tags


    // Check if it contains a year in parentheses (e.g., (2021))
    const hasYear = /^\(\d{4}\)$/.test(plainText);

    // Check for author-year format: "Author, A. (YYYY)"
    const hasAuthorYear = /^[A-Za-z\s&]+, [A-Za-z]\. \(\d{4}\)$/.test(plainText);

    // Check for citation patterns with journal names or volume/page info
    const hasVolumePagePattern = /\d{1,4}(\s*,\s*\d{1,4}[-–]?\d{1,4})?(\s*(pp?\.\s*\d{1,4}[-–]?\d{1,4})?)/g.test(plainText);

    //min 5 letter words, does not start with e.g., see
    const hasJournalName = /^(?!e\.g\.)(?!see)[A-Z][a-zA-Z\s]{4,}/.test(plainText);

    // Combine the conditions: A valid citation must match one of the patterns and should not be generic
    return hasAuthorYear || hasYear || hasJournalName || hasVolumePagePattern;
}



// Performance monitoring
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});

observer.observe({ entryTypes: ['measure'] });

console.log("Enhanced citation remover script loaded successfully");
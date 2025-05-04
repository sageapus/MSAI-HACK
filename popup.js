async function getActivityType() {
    return new Promise(function(resolve){
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, { action: 'detectActivity' }, function(response) {
            if(response.activity){
                resolve(response.activity)
            }
            else{
                resolve('general');
            }
        });
      });
    });
  }


  
  async function getScrapedInfo() {
    return new Promise(function(resolve){
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeInfo' }, (response) => {
          resolve(response || {});
        });
      });
    });
  }
  
  function detectIntent(userQuery) {
    const lower = userQuery.toLowerCase();
    if (lower.includes('discount') || lower.includes('sale') || lower.includes('deal')) return 'check_discount';
    if (lower.includes('where') || lower.includes('buy') || lower.includes('find')) return 'find_product';
    return 'general';
  }
  
  async function handleUserQuery(userQuery) {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<div><strong>You:</strong> ${userQuery}</div>`;
  
    const activityType = await getActivityType();
    const intent = detectIntent(userQuery);
    const scrapedData = await getScrapedInfo();
  
    let prompt = '';
  
    if (activityType === 'shopping') {
      if (intent === 'check_discount') {
        prompt = `A user is shopping and wants to know about discounts. The product info is:\n${JSON.stringify(scrapedData, null, 2)}.\nTell them what discounts are available.`;
      } else if (intent === 'find_product') {
        prompt = `The user wants to find a product while shopping: "${userQuery}". Suggest where they can find it online.`;
      } else {
        prompt = `The user is shopping and asked: "${userQuery}". Based on this product data: ${JSON.stringify(scrapedData, null, 2)}, give a helpful answer.`;
      }
    } else if (activityType === 'video') {
      prompt = `The user is watching a video titled "${scrapedData.title}". They asked: "${userQuery}". Suggest related videos or insights.`;
    } else if (activityType === 'reading') {
      prompt = `The user is reading an article titled "${scrapedData.articleTitle}". They said: "${userQuery}". Suggest related articles or give a short summary.`;
    } else {
      prompt = `The user asked: "${userQuery}". Provide a helpful and relevant answer.`;
    }
  
    const response = await fetch('http://localhost:3000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: userQuery,
        activityType: activityType,
        intent: intent,
        scrapedData: scrapedData
      })
    });
  
    const data = await response.json();
    const aiText = data.reply || "No response.";
    
    chatbox.innerHTML += `<div><strong>Bot:</strong> ${aiText}</div>`;
  }
  
  document.getElementById('userInput').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const userQuery = e.target.value;
      e.target.value = '';
      await handleUserQuery(userQuery);
    }
  });
  
  document.getElementById('scrapeButton').addEventListener('click', async () => {
    const data = await getScrapedInfo();
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<div><strong>Scraped Info:</strong><pre>${JSON.stringify(data, null, 2)}</pre></div>`;
  });
async function getActivityType() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'detectActivity' }, (response) => {
        resolve(response?.activity || 'general');
      });
    });
  });
}

async function getScrapedInfo() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeInfo' }, (response) => {
        resolve(response || {});
      });
    });
  });
}

function detectIntent(userQuery) {
  const lower = userQuery.toLowerCase();
  if (lower.includes('discount') || lower.includes('sale') || lower.includes('deal')) return 'check_discount';
  if (lower.includes('where') || lower.includes('buy') || lower.includes('find')) return 'find_product';
  return 'general';
}

async function handleUserQuery(userQuery) {
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div><strong>You:</strong> ${userQuery}</div>`;

  const activityType = await getActivityType();
  const intent = detectIntent(userQuery);
  const scrapedData = await getScrapedInfo();

  let prompt = '';

  if (activityType === 'shopping') {
    if (intent === 'check_discount') {
      prompt = `A user is shopping and wants to know about discounts. The product info is:\n${JSON.stringify(scrapedData, null, 2)}.\nTell them what discounts are available.`;
    } else if (intent === 'find_product') {
      prompt = `The user wants to find a product while shopping: "${userQuery}". Suggest where they can find it online.`;
    } else {
      prompt = `The user is shopping and asked: "${userQuery}". Based on this product data: ${JSON.stringify(scrapedData, null, 2)}, give a helpful answer.`;
    }
  } else if (activityType === 'video') {
    prompt = `The user is watching a video titled "${scrapedData.title}". They asked: "${userQuery}". Suggest related videos or insights.`;
  } else if (activityType === 'reading') {
    prompt = `The user is reading an article titled "${scrapedData.articleTitle}". They said: "${userQuery}". Suggest related articles or give a short summary.`;
  } else {
    prompt = `The user asked: "${userQuery}". Provide a helpful and relevant answer.`;
  }

  const response = await fetch('http://localhost:3000/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: userQuery,
    activityType: activityType,
    intent: intent,
    scrapedData: scrapedData
    })
  });

  const data = await response.json();
  const aiText = data.reply || "No response.";
  
  chatbox.innerHTML += `<div><strong>Bot:</strong> ${aiText}</div>`;
}

document.getElementById('userInput').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const userQuery = e.target.value;
    e.target.value = '';
    await handleUserQuery(userQuery);
  }
});

document.getElementById('scrapeButton').addEventListener('click', async () => {
  const data = await getScrapedInfo();
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div><strong>Scraped Info:</strong><pre>${JSON.stringify(data, null, 2)}</pre></div>`;
});
  
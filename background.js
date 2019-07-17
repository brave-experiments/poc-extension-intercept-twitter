const twitterAuthHeaders = {
}
const twitterAuthHeaderNames = [
  'authorization',
  'x-csrf-token',
  'x-guest-token',
]
console.log('adding listener')
chrome.webRequest.onSendHeaders.addListener(
  function({ requestHeaders }) {  
    console.log('Intercepted api request', requestHeaders)
    if (requestHeaders) {
      for (const header of requestHeaders) {
        if (twitterAuthHeaderNames.includes(header.name) || header.name.startsWith('x-twitter-')) {
          console.log('Received authorization header', header)
          twitterAuthHeaders[header.name] = header.value
        }
      }
    }
  },
  // filters
  {
    urls: [
      "https://api.twitter.com/1.1/*"
    ]
  },
  // extra
  [
    'requestHeaders'
  ]);


  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg && msg.type === 'getTwitterAPICredentials') {
      sendResponse(twitterAuthHeaders)
    }
  })


  
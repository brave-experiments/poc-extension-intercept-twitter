let twitterAuthHeaders = {
}
const twitterAuthHeaderNames = [
  'authorization',
  'x-csrf-token',
  'x-guest-token',
]
console.log('adding listener')

let lastSessionId

var re = new RegExp('');
const authTokenCookieRegex = /[; ]_twitter_sess=([^\s;]*)/
function readSessionCookie(cookiesString) {
  var match = cookiesString.match(authTokenCookieRegex);
  if (match) return unescape(match[1]);
  return null;
}

chrome.webRequest.onSendHeaders.addListener(
  function({ requestHeaders }) {  
    console.log('Intercepted api request', requestHeaders)
    requestHeaders
    if (requestHeaders) {
      for (const header of requestHeaders) {
        if (header.name === 'Cookie') {
          const currentSessionId = readSessionCookie(header.value)
          const hasAuthChanged = (currentSessionId !== lastSessionId)
          if (hasAuthChanged) {
            // clear cached auth data
            lastSessionId = currentSessionId
            twitterAuthHeaders = { }
          }
          console.log('got session', { currentSessionId, lastSessionId, hasAuthChanged })
        }
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
    'requestHeaders',
    'extraHeaders'
  ]);


  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg && msg.type === 'getTwitterAPICredentials') {
      sendResponse(twitterAuthHeaders)
    }
  })

  // Monitor when twitter auth changes, and clear saved auth

  // `_twitter_sess`
  

function getTwitterAPICredentials () {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {type: 'getTwitterAPICredentials'},
      resolve
    )
  })
}

async function getTweetDetails (tweetId) {
  console.log('getting tweet data')
  const credentialHeaders = await getTwitterAPICredentials()
  console.log('got auth headers', credentialHeaders)
  const url = new URL('https://api.twitter.com/1.1/statuses/show.json')
  url.searchParams.append('id', tweetId)
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      ...credentialHeaders,
    },
    referrerPolicy: "no-referrer-when-downgrade",
    method: "GET",
    mode: "cors"
  })
  const result = await response.json()
  console.log('got result', result)
  return result
}


async function init () {
  const tweets = document.querySelectorAll('[data-testid="tweet"], [data-testid="tweetDetail"]')
  for (const tweet of tweets) {
    const status = tweet.querySelector("a[href*='/status/']")
    if (!status || !status.href) {
      continue
    }
    const tweetIdMatches = status.href.match(/\d+/)
    if (tweetIdMatches && tweetIdMatches.length) {
      const tweetId = tweetIdMatches[0]
      await getTweetDetails(tweetId)
    }
  }
}

setTimeout(init, 5000)

export const normalizeFriendsData = (rawData) => {
  const data = []

  rawData.nodes.map((friend) => {
    const item = {...friend, friends: []}

    rawData.links.map((link) => {
      if (link.source === friend.id) {
        item.friends.push(link.target)
      }
    })

    data.push(item)
  })

  return data
}
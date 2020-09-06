const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let {id} = event
  const message = db.collection('message')
  message.where({
    _id: id
  }).update({
    data: {
      state: false
    }
  })
  return true
}

const M = module.exports = {}

const posts = []
const db = {
  profile: {
    snoopy: {password:'123'}
  },
  users:{
    snoopy: {
      posts: [
        {id: 0, title: '', body: ''},
        {id: 1, title: '', body: ''},
      ]
    }
  }
  
}

M.add = function (post) {
  const id = posts.push(post) - 1
  post.created_at = new Date()
  post.id = id
}
M.login = function (user, password) {
  const profile = db.profile[user]
  console.log('profile=', profile, 'password=', password)
  return (profile.password === password)
}

M.signup = function (user) {
  return db.profile[user] == null
}

M.get = function (id) {
  return posts[id]
}
M.modify = function (post) {
 posts[post.id]=post
}

M.list = function () {
  return posts
}
M.remove = function (id) {
  let post = posts[id]
  posts[id]=null
  return post
}

const serialize = (obj) => {
  var str = []
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

const getHashParams = () => {
  var hashParams = {}
  var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g,
    d = function (s) { return decodeURIComponent(s.replace(a, ' ')) },
    q = window.location.hash.substring(1)

  while (e = r.exec(q)) {
    hashParams[d(e[1])] = d(e[2])
  }

  return hashParams
}

export default serialize
export {
    getHashParams
}

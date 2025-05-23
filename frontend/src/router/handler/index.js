import router from '..'

export const toPersonalCenter = (user) => {
  router.push({
    name: 'PersonalCenter',
    params: {
      user,
    },
  })
}

/**
 *
 * @param {import('vue-router').RouteParams} param0 params
 * @param {String} param0.user email
 * @param {String|Number} param0.book book_id
 * @param {'push'|'replace'} type 路由跳转方式
 */
export const toBook = ({ user, book }, type = 'push') => {
  router[type]({
    name: 'Book',
    params: {
      user,
      book,
    },
  })
}

export const toBookByLocation = ({ user, book }) => {
  window.location.href = `/${user}/${book}`
}

/**
 *
 * @param {import('vue-router').RouteParams} param0 params
 * @param {String} param0.user email
 * @param {String|Number} param0.book book_id
 * @param {String|Number} param0.doc doc_id
 * @param {'push'|'replace'} type 路由跳转方式
 */
export const toDoc = ({ user, book, doc }, type = 'push') => {
  router[type]({
    name: 'Doc',
    params: {
      user,
      book,
      doc,
    },
  })
}

export const toDocByLocation = ({ user, book, doc }) => {
  window.location.href = `${user}/${book}/${doc}`
}

/**
 *
 * @param {'push'|'replace'} type
 */
export const toHome = (type = 'push') => {
  router[type]({
    name: 'Dashboard',
  })
}
